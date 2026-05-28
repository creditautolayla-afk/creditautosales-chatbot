import axios from 'axios';

const ZOHO_CRM_API = 'https://www.zohoapis.com/crm/v2';

export class ZohoCRM {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL: ZOHO_CRM_API,
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createLead(leadData) {
    try {
      const response = await this.client.post('/Leads', {
        data: [{
          Last_Name: leadData.lastName,
          First_Name: leadData.firstName || '',
          Phone: leadData.phone || '',
          Email: leadData.email || '',
          Budget: leadData.budget || '',
          Trade_in_Vehicle: leadData.tradeInVehicle || '',
          Credit_Situation: leadData.creditSituation || '',
          Desired_Vehicle_Type: leadData.desiredVehicleType || '',
          Lead_Source: 'Website Chatbot'
        }]
      });

      if (response.data.data && response.data.data[0]) {
        const leadId = response.data.data[0].id;
        console.log(`✅ Lead created in Zoho: ${leadId}`);
        return { success: true, leadId, leadData: response.data.data[0] };
      }

      return { success: false, message: 'No lead ID returned' };
    } catch (error) {
      console.error('Error creating lead:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  async addTestDriveTask(leadId, taskData) {
    try {
      const response = await this.client.post('/Tasks', {
        data: [{
          Subject: `Test Drive - ${taskData.vehicleInterest}`,
          Description: `Customer wants to test drive: ${taskData.vehicleInterest}\nDate/Time: ${taskData.dateTime}`,
          What_id: leadId,
          Due_Date: taskData.dueDate,
          Status: 'Not Started',
          Priority: 'High'
        }]
      });

      if (response.data.data && response.data.data[0]) {
        console.log(`✅ Test drive task created in Zoho`);
        return { success: true, taskId: response.data.data[0].id };
      }

      return { success: false, message: 'No task ID returned' };
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  async getLead(email) {
    try {
      const response = await this.client.get('/Leads/search', {
        params: {
          email: email,
          fields: 'id,First_Name,Last_Name,Email,Phone'
        }
      });

      if (response.data.data && response.data.data.length > 0) {
        return { success: true, lead: response.data.data[0] };
      }

      return { success: false, message: 'Lead not found' };
    } catch (error) {
      console.error('Error getting lead:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export default ZohoCRM;
