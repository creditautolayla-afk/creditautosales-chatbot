import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ChatBot } from './chatbot.js';
import ZohoCRM from './zoho.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Load config from environment variables or file
let config = {
  dealership: {
    name: "Credit Auto Sales",
    address: "1275 finch ave w",
    phone: "4377576977",
    email: "creditautonow@gmail.com",
    website: "https://creditautosales.ca/",
    hours: { weekday: "10am-7pm", saturday: "10am-5pm" },
    testDrive: { weekday: "11am-6pm", saturday: "11am-4pm" }
  },
  zoho: {
    apiToken: process.env.ZOHO_API_TOKEN || ""
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || ""
  }
};

try {
  const configFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
  config = { ...config, ...configFile };
} catch (e) {
  console.log('Using environment variables for config');
}

const zoho = new ZohoCRM(config.zoho.apiToken);
const chatbots = new Map();
let inventory = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/dealership', (req, res) => {
  res.json(config.dealership);
});

app.get('/api/inventory', (req, res) => {
  res.json({
    total: inventory.length,
    vehicles: inventory.slice(0, 20)
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
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
      customerData: response.customerData,
      usage: response.usage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/submit-lead', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, budget, tradeInVehicle, creditSituation, desiredVehicleType } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone && !email) {
      return res.status(400).json({ error: 'Phone or email is required' });
    }
    const leadResult = await zoho.createLead({
      firstName,
      lastName,
      phone,
      email,
      budget,
      tradeInVehicle,
      creditSituation,
      desiredVehicleType
    });
    if (!leadResult.success) {
      return res.status(500).json({ error: 'Failed to create lead' });
    }
    res.json({
      success: true,
      leadId: leadResult.leadId,
      message: 'Lead created successfully'
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/book-test-drive', async (req, res) => {
  try {
    const { leadId, vehicleInterest, dateTime, dueDate } = req.body;
    if (!leadId || !vehicleInterest || !dateTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const taskResult = await zoho.addTestDriveTask(leadId, {
      vehicleInterest,
      dateTime,
      dueDate: dueDate || dateTime.split(' ')[0]
    });
    if (!taskResult.success) {
      return res.status(500).json({ error: 'Failed to book test drive' });
    }
    res.json({
      success: true,
      taskId: taskResult.taskId,
      message: 'Test drive booked successfully'
    });
  } catch (error) {
    console.error('Test drive booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Credit Auto Sales Chatbot running on port ${PORT}`);
});
