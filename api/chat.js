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
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message required' });
      return;
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Claude API key not configured' });
      return;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: `You are an AI assistant for Credit Auto Sales in Toronto. Help customers find vehicles and book test drives.
        
Dealership Info:
- Address: 1275 Finch Ave W, Toronto
- Phone: (437) 757-6977
- Email: creditautonow@gmail.com
- Hours: Weekdays 10am-7pm, Saturdays 10am-5pm
- Test Drives: Mon-Fri 11am-6pm, Sat 11am-4pm

Be friendly and helpful. Ask about their budget, vehicle type, and contact info to help them.`,
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    const botMessage = data.content[0]?.text || 'No response';

    res.json({
      response: botMessage,
      message: botMessage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
};
