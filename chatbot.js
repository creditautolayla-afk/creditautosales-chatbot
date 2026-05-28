import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an interactive AI assistant for Credit Auto Sales, a car dealership in Toronto. Your role is to help customers find vehicles, discuss financing options, and book test drives.

## Dealership Info:
- **Name**: Credit Auto Sales
- **Address**: 1275 Finch Ave W, Toronto, Ontario
- **Phone**: (437) 757-6977
- **Email**: creditautonow@gmail.com
- **Website**: https://creditautosales.ca/
- **Hours**: Weekdays 10am-7pm, Saturdays 10am-5pm
- **Test Drive Hours**: Weekdays 11am-6pm, Saturdays 11am-4pm

## Your Responsibilities:
1. **Help customers find vehicles** - Ask about their preferences (budget, vehicle type, features)
2. **Discuss financing** - Explain that we work with banks and third-party lenders for customers with bad credit
3. **Share credit requirements** - Mention that we have flexible financing options
4. **Book test drives** - Collect appointment info (preferred date/time, vehicle interest)
5. **Capture contact info** - Gather name, phone, email, budget, trade-in vehicle, credit situation, desired vehicle type
6. **Answer questions** - About vehicles, financing, dealership, hours, location

## Important Notes:
- When discussing financing applications, direct customers to the finance section on our website
- Be professional, friendly, and helpful
- Always confirm test drive appointments
- Keep the conversation natural and engaging
- If you don't know vehicle details, ask them to visit our inventory on the website
- Encourage customers to book test drives

## When collecting information:
- Be conversational - don't ask all questions at once
- Confirm information before submitting
- Let them know their data will be saved to our leads system`;

export class ChatBot {
  constructor(inventory = [], dealershipInfo = {}) {
    this.inventory = inventory;
    this.dealershipInfo = dealershipInfo;
    this.conversationHistory = [];
  }

  setInventory(inventory) {
    this.inventory = inventory;
  }

  async chat(userMessage) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    try {
      // Call Claude with prompt caching for the system prompt
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' }
          },
          {
            type: 'text',
            text: `Current inventory: ${JSON.stringify(this.inventory.slice(0, 5))}` // Cache inventory context
          }
        ],
        messages: this.conversationHistory
      });

      const assistantMessage = response.content[0].text;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Extract potential customer data from the conversation
      const customerData = this.extractCustomerData();

      return {
        message: assistantMessage,
        customerData,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheCreationTokens: response.usage.cache_creation_input_tokens || 0,
          cacheReadTokens: response.usage.cache_read_input_tokens || 0
        }
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  extractCustomerData() {
    // Simple extraction of customer data from conversation history
    const data = {
      name: null,
      phone: null,
      email: null,
      budget: null,
      tradeInVehicle: null,
      creditSituation: null,
      desiredVehicleType: null,
      testDriveDate: null,
      testDriveTime: null
    };

    // Pattern matching for common customer data
    const fullConversation = this.conversationHistory.map(m => m.content).join(' ');

    // Phone pattern (basic Canadian)
    const phoneMatch = fullConversation.match(/\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/);
    if (phoneMatch) data.phone = `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`;

    // Email pattern
    const emailMatch = fullConversation.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) data.email = emailMatch[0];

    // Budget pattern
    const budgetMatch = fullConversation.match(/\$?([\d,]+(?:\.\d{2})?)/);
    if (budgetMatch) data.budget = budgetMatch[1];

    return data;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  resetConversation() {
    this.conversationHistory = [];
  }
}

export default ChatBot;
