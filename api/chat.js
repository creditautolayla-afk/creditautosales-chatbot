import { ChatBot } from '../src/chatbot.js';

const chatbots = new Map();
let inventory = [];

const config = {
  dealership: {
    name: "Credit Auto Sales",
    address: "1275 finch ave w",
    phone: "4377576977",
    email: "creditautonow@gmail.com",
    website: "https://creditautosales.ca/",
    hours: { weekday: "10am-7pm", saturday: "10am-5pm" },
    testDrive: { weekday: "11am-6pm", saturday: "11am-4pm" }
  },
  zoho: { apiToken: process.env.ZOHO_API_TOKEN || "" },
  claude: { apiKey: process.env.CLAUDE_API_KEY || "" }
};

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
    const { message, sessionId } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message required' });
      return;
    }

    const session = sessionId || `session_${Date.now()}`;
    if (!chatbots.has(session)) {
      chatbots.set(session, new ChatBot(inventory, config.dealership));
    }

    const chatbot = chatbots.get(session);
    const response = await chatbot.chat(message);

    res.json({
      sessionId: session,
      response: response.message,
      customerData: response.customerData
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
};
