import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { ChatBot } from './chatbot.js';
import ZohoCRM from './zoho.js';
import { testHillzDealerLogin, checkHillzDealerAPI, getInventoryFromHillzDealer } from './hillzdealer.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load config
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Initialize services
const zoho = new ZohoCRM(config.zoho.apiToken);
const chatbots = new Map(); // Store chatbot instances per session
let inventory = [];

// Initialize on startup
async function initialize() {
  console.log('Initializing Credit Auto Sales Chatbot...');

  // Test HillzDealer connection
  const loginTest = await testHillzDealerLogin(config.hillzdealer.username, config.hillzdealer.password);
  console.log('HillzDealer login:', loginTest.message);

  // Check for API
  const apiCheck = await checkHillzDealerAPI();
  console.log('HillzDealer API:', apiCheck.message || apiCheck.endpoint);

  // Fetch inventory
  try {
    inventory = await getInventoryFromHillzDealer(config.hillzdealer.username, config.hillzdealer.password);
    console.log(`✅ Loaded ${inventory.length} vehicles from HillzDealer`);
  } catch (error) {
    console.error('Error loading inventory:', error.message);
    inventory = [];
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get dealership info
app.get('/api/dealership', (req, res) => {
  res.json(config.dealership);
});

// Get inventory
app.get('/api/inventory', (req, res) => {
  res.json({
    total: inventory.length,
    vehicles: inventory.slice(0, 20) // Return first 20 for preview
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const session = sessionId || `session_${Date.now()}`;

    // Get or create chatbot for this session
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

// Submit lead (save to Zoho)
app.post('/api/submit-lead', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, budget, tradeInVehicle, creditSituation, desiredVehicleType } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!phone && !email) {
      return res.status(400).json({ error: 'Phone or email is required' });
    }

    // Create lead in Zoho
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

// Book test drive
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

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Credit Auto Sales Chatbot running on port ${PORT}`);
  await initialize();
});
