// Get inventory from cache or fetch fresh
let inventoryCache = null;
let inventoryCacheTime = 0;

async function getInventory() {
  const now = Date.now();
  
  // Return cached if fresh (within 30 minutes)
  if (inventoryCache && (now - inventoryCacheTime) < 1800000) {
    return inventoryCache;
  }

  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/inventory`);
    const data = await response.json();
    inventoryCache = data.vehicles || [];
    inventoryCacheTime = now;
    return inventoryCache;
  } catch (error) {
    console.log('Error fetching inventory:', error.message);
    return [];
  }
}

// Zoho CRM functions
async function saveLeadToZoho(leadData) {
  if (!leadData.email && !leadData.phone) return null;

  try {
    const response = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{
          Last_Name: leadData.lastName || 'Customer',
          First_Name: leadData.firstName || '',
          Phone: leadData.phone || '',
          Email: leadData.email || '',
          Budget: leadData.budget || '',
          Trade_in_Vehicle: leadData.tradeInVehicle || '',
          Desired_Vehicle_Type: leadData.desiredVehicleType || '',
          Lead_Source: 'Website Chatbot'
        }]
      })
    });

    const result = await response.json();
    if (result.data && result.data[0]?.id) {
      console.log('Lead saved:', result.data[0].id);
      return result.data[0].id;
    }
  } catch (error) {
    console.log('Error saving lead:', error.message);
  }

  return null;
}

async function bookTestDrive(leadId, vehicleInterest, dateTime) {
  try {
    const response = await fetch('https://www.zohoapis.com/crm/v2/Tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{
          Subject: `Test Drive - ${vehicleInterest}`,
          Description: `Customer wants to test drive: ${vehicleInterest}\nScheduled for: ${dateTime}`,
          What_id: leadId,
          Due_Date: dateTime.split(' ')[0],
          Status: 'Not Started',
          Priority: 'High'
        }]
      })
    });

    const result = await response.json();
    if (result.data && result.data[0]?.id) {
      console.log('Test drive booked:', result.data[0].id);
      return true;
    }
  } catch (error) {
    console.log('Error booking test drive:', error.message);
  }

  return false;
}

// Extract customer data from conversation
function extractCustomerData(fullText) {
  const data = {
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    budget: null,
    vehicleType: null
  };

  // Email pattern
  const emailMatch = fullText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) data.email = emailMatch[0];

  // Phone pattern (Canadian)
  const phoneMatch = fullText.match(/\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/);
  if (phoneMatch) data.phone = `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`;

  // Budget pattern
  const budgetMatch = fullText.match(/(\$|budget.*?)(\d{1,3}(?:,?\d{3})*(?:\.\d{2})?)/i);
  if (budgetMatch) data.budget = budgetMatch[2];

  // Name patterns (look for "my name is X" or "I'm X")
  const nameMatch = fullText.match(/(?:my name is|I'm|I am|call me)\s+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/i);
  if (nameMatch) {
    data.firstName = nameMatch[1];
    data.lastName = nameMatch[2] || '';
  }

  // Vehicle type patterns
  const vehicleMatch = fullText.match(/(?:looking for|interested in|want|need)\s+(?:a\s+)?([A-Za-z\s]+?)(?:\s+for|\.|$)/i);
  if (vehicleMatch) {
    data.vehicleType = vehicleMatch[1].trim();
  }

  return data;
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Get inventory
    const inventory = await getInventory();
    
    // Build inventory context
    const inventoryContext = inventory.length > 0
      ? `Current inventory (samples): ${JSON.stringify(inventory.slice(0, 5))}`
      : 'Inventory information is currently being updated.';

    const systemPrompt = `You are an interactive AI assistant for Credit Auto Sales, a car dealership in Toronto.

## Dealership Info:
- Address: 1275 Finch Ave W, Toronto, Ontario
- Phone: (437) 757-6977
- Email: creditautonow@gmail.com
- Website: https://creditautosales.ca/
- Hours: Mon-Fri 10am-7pm, Sat 10am-5pm
- Test Drive Hours: Mon-Fri 11am-6pm, Sat 11am-4pm

## Your Role:
1. Help customers find vehicles matching their needs
2. Discuss financing options (we work with banks & lenders for all credit situations)
3. Book test drives
4. Answer questions about our dealership
5. Be friendly and professional

${inventoryContext}

When customers share their contact info (name, phone, email), acknowledge it naturally. Be conversational. If they mention wanting a test drive, confirm the vehicle type and preferred date/time.`;

    // Prepare messages for Claude
    const messages = [
      ...(history || []),
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Claude error:', data);
      return res.status(500).json({ error: data.error?.message || 'API error' });
    }

    const botResponse = data.content[0]?.text || 'No response';

    // Extract customer data from full conversation
    const fullConversation = messages.map(m => m.content).join(' ') + ' ' + botResponse;
    const customerData = extractCustomerData(fullConversation);

    let leadSaved = false;
    let testDriveBooked = false;
    let leadId = null;

    // Auto-save lead if we have contact info
    if (customerData.email || customerData.phone) {
      leadId = await saveLeadToZoho({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        email: customerData.email,
        budget: customerData.budget,
        desiredVehicleType: customerData.vehicleType
      });

      if (leadId) {
        leadSaved = true;
      }
    }

    // Auto-book test drive if mentioned
    if (leadId && customerData.vehicleType && 
        (botResponse.toLowerCase().includes('test drive') || message.toLowerCase().includes('test drive'))) {
      // Try to extract date from conversation
      const dateMatch = fullConversation.match(/(?:tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2})/i);
      const testDate = dateMatch ? dateMatch[0] : 'TBD';
      
      testDriveBooked = await bookTestDrive(leadId, customerData.vehicleType, `${testDate} 1:00 PM`);
    }

    res.json({
      response: botResponse,
      leadSaved,
      testDriveBooked,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
};
