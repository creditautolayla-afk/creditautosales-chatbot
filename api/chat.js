export default async function handler(req, res) {
  // CORS headers
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
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Get inventory (with caching)
    let inventory = [];
    try {
      const inventoryRes = await fetch(
        `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/inventory`,
        { timeout: 5000 }
      );
      if (inventoryRes.ok) {
        const data = await inventoryRes.json();
        inventory = data.vehicles || [];
      }
    } catch (err) {
      console.log('Inventory fetch failed, using fallback:', err.message);
    }

    // Build inventory context
    const inventoryContext =
      inventory.length > 0
        ? `\n\nCurrent Inventory:\n${inventory.map(v => `- ${v.year} ${v.make} ${v.model} - $${v.price} (${v.color})`).join('\n')}`
        : '';

    // System prompt
    const systemPrompt = `You are a helpful AI assistant for Credit Auto Sales, a car dealership located at 1275 Finch Ave W, Toronto, ON.

Dealership Info:
- Phone: 437-757-6977
- Email: creditautonow@gmail.com
- Website: https://creditautosales.ca/
- Hours: Mon-Fri 10am-7pm, Sat 10am-5pm
- Test Drive Hours: Mon-Fri 11am-6pm, Sat 11am-4pm
- Financing: We offer flexible financing options for customers with various credit situations.

Your responsibilities:
1. Help customers find vehicles matching their needs
2. Provide financing guidance
3. Book test drive appointments (available during test drive hours)
4. Capture customer contact info when they naturally share it
5. Be professional, friendly, and helpful

When a customer mentions they're interested in a test drive, suggest available times and ask for their preferred date/time.
When discussing financing, mention our website (creditautosales.ca) for the finance application.

${inventoryContext}`;

    // Prepare messages for Claude API
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude error:', errorData);
      res.status(500).json({ error: 'Claude API error', details: errorData });
      return;
    }

    const claudeResponse = await response.json();
    const assistantMessage = claudeResponse.content[0].text;

    // Extract customer data
    const fullConversation = messages.map(m => m.content).join(' ') + ' ' + assistantMessage;

    const phoneMatch = fullConversation.match(/(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/);
    const phone = phoneMatch ? `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}` : null;

    const emailMatch = fullConversation.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const email = emailMatch ? emailMatch[0] : null;

    const budgetMatch = fullConversation.match(/\$[\d,]+|budget[:\s]+\$?[\d,]+/i);
    const budget = budgetMatch ? budgetMatch[0] : null;

    const nameMatch = fullConversation.match(/(?:my name is|I'm|I am)\s+([A-Za-z\s]+?)(?:\.|,|$)/i);
    const name = nameMatch ? nameMatch[1].trim() : null;

    const vehicleMatch = fullConversation.match(/(?:looking for|interested in|want|need)\s+(?:a\s+)?([A-Za-z\s]+?)(?:\.|,|$|and)/i);
    const vehicleType = vehicleMatch ? vehicleMatch[1].trim() : null;

    let leadSaved = false;
    let testDriveBooked = false;

    // Save to Zoho if we have phone or email
    if ((phone || email) && process.env.ZOHO_API_TOKEN) {
      try {
        const leadPayload = {
          data: [
            {
              Last_Name: name || 'Customer',
              First_Name: name ? name.split(' ')[0] : 'Website',
              Phone: phone || '',
              Email: email || '',
              Budget: budget || '',
              Trade_in_Vehicle: '',
              Desired_Vehicle_Type: vehicleType || '',
              Lead_Source: 'Website Chatbot'
            }
          ]
        };

        const zohoRes = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
          method: 'POST',
          headers: {
            'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(leadPayload),
          timeout: 5000
        });

        if (zohoRes.ok) {
          leadSaved = true;
          console.log('Lead saved to Zoho');
        } else {
          console.log('Zoho lead save failed:', zohoRes.status);
        }
      } catch (err) {
        console.log('Zoho error:', err.message);
      }
    }

    // Book test drive if mentioned
    if (vehicleType && fullConversation.toLowerCase().includes('test drive') && process.env.ZOHO_API_TOKEN) {
      try {
        const taskPayload = {
          data: [
            {
              Subject: `Test Drive: ${vehicleType}`,
              Description: `Customer interested in test drive for ${vehicleType}. Phone: ${phone || 'Not provided'}. Email: ${email || 'Not provided'}`,
              Status: 'Open',
              Priority: 'High'
            }
          ]
        };

        const taskRes = await fetch('https://www.zohoapis.com/crm/v2/Tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskPayload),
          timeout: 5000
        });

        if (taskRes.ok) {
          testDriveBooked = true;
          console.log('Test drive task created in Zoho');
        } else {
          console.log('Zoho task creation failed:', taskRes.status);
        }
      } catch (err) {
        console.log('Zoho task error:', err.message);
      }
    }

    res.status(200).json({
      response: assistantMessage,
      leadSaved,
      testDriveBooked,
      usage: claudeResponse.usage
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
