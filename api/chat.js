export default async (req, res) => {
  // Enable CORS
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
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Claude API key not configured' });
      return;
    }

    const systemPrompt = `You are a helpful AI assistant for Credit Auto Sales, a car dealership in Toronto.

Dealership Info:
- Name: Credit Auto Sales
- Address: 1275 Finch Ave W, Toronto
- Phone: 437-757-6977
- Email: creditautonow@gmail.com
- Website: https://creditautosales.ca
- Hours: Mon-Fri 10am-7pm, Sat 10am-5pm
- Test Drive Hours: Mon-Fri 11am-6pm, Sat 11am-4pm

Your role:
1. Help customers find vehicles they're interested in
2. Answer questions about financing (we work with banks and lenders for bad credit)
3. Provide dealership information
4. Help book test drives
5. Collect customer contact info (name, phone, email, budget, vehicle interests)

Be friendly, professional, and helpful. Always try to understand what vehicle the customer is looking for and their budget.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:model: 'claude-opus-4-7',
            console.log('Calling Claude API with key:', apiKey.substring(0, 20) + '...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const responseText = await response.text();
    console.log('API Response status:', response.status);
    console.log('API Response:', responseText);

    if (!response.ok) {
      res.status(response.status).json({
        error: 'Claude API error: ' + responseText.substring(0, 200)
      });
      return;
    }

    const data = JSON.parse(responseText);
    const botResponse = data.content[0]?.text || 'No response';

    res.status(200).json({
      response: botResponse
    });
