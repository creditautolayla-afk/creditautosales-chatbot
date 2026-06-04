const ACTUAL_INVENTORY = [
  { year: 2017, make: 'Subaru', model: 'Forester', mileage: 173533, price: 12999 },
  { year: 2016, make: 'Audi', model: 'Q5', mileage: 149059, price: 11999 },
  { year: 2015, make: 'Chevrolet', model: 'Tahoe', mileage: 179555, price: 21999 },
  { year: 2004, make: 'Nissan', model: '350Z', mileage: 77796, price: 15999 },
  { year: 2017, make: 'Volkswagen', model: 'Jetta', mileage: 323000, price: 5500 },
  { year: 2017, make: 'Volvo', model: 'XC90', mileage: 155435, price: 19999 },
  { year: 2021, make: 'Ford', model: 'F150', mileage: 164057, price: 32999 },
  { year: 2016, make: 'Nissan', model: 'Versa Note', mileage: 125778, price: 5999 },
  { year: 2013, make: 'Nissan', model: 'NV200', mileage: 150500, price: 7999 },
  { year: 2021, make: 'Toyota', model: 'Sienna', mileage: 154717, price: 36180 },
  { year: 2018, make: 'Hyundai', model: 'Sonata', mileage: 151835, price: 12650 },
  { year: 2018, make: 'Audi', model: 'A3', mileage: 125111, price: 16158 },
  { year: 2017, make: 'Mercedes-Benz', model: 'GLA 250', mileage: 121113, price: 17945 },
  { year: 2017, make: 'Nissan', model: 'Altima', mileage: 195111, price: 9836 },
  { year: 2016, make: 'Mercedes-Benz', model: 'S550', mileage: 87888, price: 40455 },
  { year: 2016, make: 'Kia', model: 'Sportage', mileage: 140978, price: 12978 },
  { year: 2016, make: 'Audi', model: 'A3', mileage: 129889, price: 12968 },
  { year: 2016, make: 'Toyota', model: 'Highlander', mileage: 219551, price: 18685 },
  { year: 2015, make: 'Chevrolet', model: 'Cruze', mileage: 128999, price: 12780 },
  { year: 2015, make: 'Jeep', model: 'Cherokee', mileage: 112033, price: 13929 },
  { year: 2015, make: 'Dodge', model: 'Grand Caravan', mileage: 146367, price: 12715 },
  { year: 2011, make: 'Nissan', model: 'Juke', mileage: 161255, price: 7539 },
  { year: 2018, make: 'Honda', model: 'CRV', mileage: 126163, price: 20999 },
  { year: 2022, make: 'Ram', model: '1500', mileage: 173519, price: 25999 },
  { year: 2020, make: 'Ford', model: 'Raptor', mileage: 65511, price: 76999 },
  { year: 2018, make: 'Ford', model: 'F150', mileage: 172927, price: 23999 },
  { year: 2018, make: 'Honda', model: 'CRV', mileage: 159248, price: 20999 },
  { year: 2020, make: 'Mercedes-Benz', model: 'Sprinter', mileage: 174633, price: 31999 },
  { year: 2021, make: 'Toyota', model: 'Corolla', mileage: 27885, price: 23788 },
  { year: 2010, make: 'Toyota', model: 'Prius', mileage: 191250, price: 9995 },
  { year: 2018, make: 'Toyota', model: 'CHR', mileage: 122255, price: 17999 },
  { year: 2020, make: 'Ram', model: 'Promaster', mileage: 63955, price: 37188 },
  { year: 2013, make: 'Hyundai', model: 'Elantra', mileage: 147955, price: 8566 },
  { year: 2012, make: 'Jeep', model: 'Grand Cherokee', mileage: 199885, price: 11999 },
  { year: 2019, make: 'Mercedes-Benz', model: 'Sprinter', mileage: 135218, price: 33999 },
  { year: 2004, make: 'Pontiac', model: 'Grand Am', mileage: 271500, price: 2500 },
  { year: 2013, make: 'Nissan', model: 'Murano', mileage: 167800, price: 10980 },
  { year: 2013, make: 'Mini', model: 'Cooper', mileage: 118930, price: 9238 },
  { year: 2013, make: 'Lincoln', model: 'MKZ', mileage: 195170, price: 9999 },
  { year: 2012, make: 'Kia', model: 'Sportage', mileage: 196300, price: 6999 },
  { year: 2016, make: 'Kia', model: 'Sportage', mileage: 104210, price: 14999 },
  { year: 2021, make: 'Jeep', model: 'Grand Cherokee', mileage: 63528, price: 39115 },
  { year: 2015, make: 'Jaguar', model: 'XF', mileage: 119111, price: 13999 },
  { year: 2014, make: 'Honda', model: 'Civic', mileage: 157309, price: 11999 },
  { year: 2013, make: 'Honda', model: 'Civic', mileage: 179925, price: 9999 },
  { year: 2017, make: 'Honda', model: 'CRV', mileage: 159500, price: 17999 },
  { year: 2020, make: 'Ford', model: 'Escape', mileage: 47455, price: 37888 },
  { year: 2015, make: 'Chrysler', model: '200C', mileage: 135555, price: 11665 },
  { year: 2008, make: 'Chrysler', model: 'Sebring', mileage: 211070, price: 2999 },
  { year: 2013, make: 'BMW', model: '3 Series', mileage: 119258, price: 12415 },
  { year: 2023, make: 'Kia', model: 'Forte', mileage: 13531, price: 22699 },
  { year: 2020, make: 'Kia', model: 'Forte', mileage: 154520, price: 11999 },
  { year: 2013, make: 'Audi', model: 'A4', mileage: 207111, price: 6599 },
  { year: 2022, make: 'Tesla', model: 'Model 3', mileage: 565, price: 48999 },
  { year: 2015, make: 'Acura', model: 'TLX', mileage: 156211, price: 15850 },
  { year: 2017, make: 'Subaru', model: 'BRZ', mileage: 80050, price: 22888 },
  { year: 2020, make: 'Ford', model: 'Escape', mileage: 37447, price: 29999 },
  { year: 2017, make: 'Dodge', model: 'Grand Caravan', mileage: 159611, price: 11999 },
  { year: 2017, make: 'Toyota', model: 'Highlander', mileage: 216583, price: 22175 },
  { year: 2014, make: 'Dodge', model: 'Journey', mileage: 133755, price: 8995 },
  { year: 2015, make: 'Ram', model: '1500', mileage: 157368, price: 23999 },
  { year: 2016, make: 'Kia', model: 'Soul', mileage: 103999, price: 13888 },
  { year: 2016, make: 'Hyundai', model: 'Sonata', mileage: 158660, price: 10778 },
  { year: 2013, make: 'Subaru', model: 'BRZ', mileage: 161511, price: 14888 },
  { year: 2008, make: 'Jeep', model: 'Wrangler', mileage: 210076, price: 12999 },
  { year: 2008, make: 'Audi', model: 'Q7', mileage: 197111, price: 8999 },
  { year: 2015, make: 'Honda', model: 'Odyssey', mileage: 162500, price: 14999 },
  { year: 2017, make: 'Honda', model: 'Pilot', mileage: 176801, price: 21228 },
  { year: 2018, make: 'Toyota', model: 'CHR', mileage: 122818, price: 17999 },
  { year: 2017, make: 'Ram', model: '1500', mileage: 178755, price: 23999 },
  { year: 2021, make: 'Ford', model: 'Transit', mileage: 107413, price: 45000 },
  { year: 2018, make: 'Mercedes-Benz', model: 'G 63', mileage: 132516, price: 84999 },
  { year: 2020, make: 'Land Rover', model: 'Range Rover', mileage: 59936, price: 55999 },
  { year: 2002, make: 'BMW', model: 'M3', mileage: 123111, price: 23999 },
  { year: 2017, make: 'Lexus', model: 'GX460', mileage: 106511, price: 47888 },
  { year: 2018, make: 'Toyota', model: 'Highlander', mileage: 101211, price: 30999 },
  { year: 2020, make: 'Toyota', model: 'RAV4', mileage: 127211, price: 31425 },
  { year: 2016, make: 'Acura', model: 'MDX', mileage: 182111, price: 17999 },
  { year: 2015, make: 'Land Rover', model: 'Range Rover', mileage: 123555, price: 15599 },
  { year: 2018, make: 'Audi', model: 'A6', mileage: 82255, price: 27916 },
  { year: 2021, make: 'Chevrolet', model: 'Spark', mileage: 11115, price: 18810 },
  { year: 2014, make: 'Kia', model: 'Forte', mileage: 125811, price: 6999 },
  { year: 2017, make: 'Dodge', model: 'Grand Caravan', mileage: 217211, price: 7999 },
  { year: 2017, make: 'Mini', model: 'Cooper', mileage: 170211, price: 9999 },
  { year: 2017, make: 'Hyundai', model: 'Sonata', mileage: 161167, price: 10999 },
  { year: 2016, make: 'Dodge', model: 'Grand Caravan', mileage: 0, price: 8999 },
  { year: 2023, make: 'Subaru', model: 'WRX', mileage: 19922, price: 30789 },
  { year: 2015, make: 'Nissan', model: 'Pathfinder', mileage: 137711, price: 9995 },
  { year: 2017, make: 'Jaguar', model: 'XF', mileage: 127611, price: 19888 },
  { year: 2022, make: 'BMW', model: 'X5', mileage: 25211, price: 59999 }
];

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

    // Use inventory directly
    const inventory = ACTUAL_INVENTORY || [];

    // Build inventory context
    const inventoryContext =
      inventory.length > 0
        ? `\n\nCURRENT INVENTORY (${inventory.length} vehicles):\n${inventory.map(v => `${v.year} ${v.make} ${v.model} - $${v.price} (${v.mileage} km)`).join('\n')}`
        : '';

    // System prompt
    const systemPrompt = `You are a professional customer service representative for Credit Auto Sales.

DEALERSHIP INFO:
📍 Location: 1275 Finch Ave W, Unit 617, Toronto, ON
📞 Phone: 437-757-6977
📧 Email: creditautonow@gmail.com
🌐 Website: creditautosales.ca
⏰ Hours: Monday-Friday 11am-6pm, Saturday 11am-4pm
INSTRUCTIONS:
1. ALWAYS check the inventory list below for customer vehicle requests
2. If customer asks about a specific vehicle, search the inventory and provide year, make, model, and price
3. If customer wants to book a test drive:
   - Ask for their name, phone, email, and preferred date/time
   - Confirm the booking: "Great! I've booked your test drive for [DATE/TIME]. Our team will confirm at [PHONE]"
   - Do NOT say "unfortunately I'm not able to book" - you ARE able to book
4. Only provide phone/email when customer explicitly asks to speak with someone or if you can't find what they're looking for
5. Be helpful, friendly, and professional. Keep responses brief.
6. Use emojis naturally but avoid markdown/asterisks. Format lists with line breaks, not bullets.
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
        model: 'claude-sonnet-4-6',
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

        const zohoRes = await fetch('https://www.zohoapis.ca/crm/v2/Leads', {
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

        const taskRes = await fetch('https://www.zohoapis.ca/crm/v2/Tasks', {
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
