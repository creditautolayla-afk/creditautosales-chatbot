import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatBot } from './chatbot.js';
import ZohoCRM from './zoho.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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

const zoho = new ZohoCRM(config.zoho.apiToken);
const chatbots = new Map();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/dealership', (req, res) => {
  res.json(config.dealership);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    
    const session = sessionId || `session_${Date.now()}`;
    if (!chatbots.has(session)) {
      chatbots.set(session, new ChatBot([], config.dealership));
    }
    
    const chatbot = chatbots.get(session);
    const response = await chatbot.chat(message);
    res.json({ sessionId: session, response: response.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
