export default async (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Credit Auto Sales - AI Chatbot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; height: 100vh; display: flex; }
        .sidebar { width: 300px; background: #003d82; color: white; padding: 30px; overflow-y: auto; }
        .sidebar h2 { margin-bottom: 20px; font-size: 22px; }
        .sidebar p { line-height: 1.6; font-size: 14px; margin-bottom: 20px; }
        .sidebar .section { margin-bottom: 30px; }
        .sidebar .label { font-weight: bold; color: #fff; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .chat-container { flex: 1; display: flex; flex-direction: column; background: white; }
        .chat-header { background: #003d82; color: white; padding: 20px; text-align: center; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .message { padding: 12px 16px; border-radius: 10px; max-width: 80%; word-wrap: break-word; }
        .message.user { background: #003d82; color: white; align-self: flex-end; }
        .message.bot { background: #e8e8e8; color: #333; }
        .message.info { background: #d4edda; color: #155724; font-size: 13px; }
        .typing { display: flex; gap: 4px; align-items: center; }
        .typing span { width: 8px; height: 8px; background: #999; border-radius: 50%; animation: bounce 1.4s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { opacity: 0.5; } 40% { opacity: 1; } }
        .chat-input { display: flex; gap: 10px; padding: 20px; border-top: 1px solid #ddd; }
        .chat-input input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        .chat-input button { padding: 12px 24px; background: #003d82; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .chat-input button:hover { background: #002a5c; }
        .chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) {
          .container { flex-direction: column; }
          .sidebar { width: 100%; height: auto; padding: 20px; }
          .message { max-width: 90%; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="sidebar">
          <h2>Credit Auto Sales</h2>
          <div class="section">
            <div class="label">📍 Address</div>
            <p>1275 Finch Ave W<br>Toronto, Ontario</p>
          </div>
          <div class="section">
            <div class="label">📞 Phone</div>
            <p>(437) 757-6977</p>
          </div>
          <div class="section">
            <div class="label">✉️ Email</div>
            <p>creditautonow@gmail.com</p>
          </div>
          <div class="section">
            <div class="label">🕐 Hours</div>
            <p>Mon-Fri: 10am-7pm<br>Sat: 10am-5pm</p>
          </div>
          <div class="section">
            <div class="label">🚗 Test Drive</div>
            <p>Mon-Fri: 11am-6pm<br>Sat: 11am-4pm</p>
          </div>
          <div class="section">
            <div class="label">💰 Financing</div>
            <p>We work with banks & lenders for all credit situations.</p>
          </div>
        </div>
        <div class="chat-container">
          <div class="chat-header">
            <h3>AI Assistant</h3>
            <p>Ask me anything about our vehicles, financing, or book a test drive</p>
          </div>
          <div class="chat-messages" id="messages">
            <div class="message bot">👋 Hello! I'm here to help you find the perfect vehicle at Credit Auto Sales. What are you looking for today?</div>
          </div>
          <div class="chat-input">
            <input type="text" id="input" placeholder="Type your message..." />
            <button onclick="sendMessage()" id="sendBtn">Send</button>
          </div>
        </div>
      </div>

      <script>
        let conversationHistory = [];

        async function sendMessage() {
          const input = document.getElementById('input');
          const messages = document.getElementById('messages');
          const sendBtn = document.getElementById('sendBtn');
          const text = input.value.trim();
          
          if (!text) return;
          
          // Add user message to DOM and history
          messages.innerHTML += '<div class="message user">' + escapeHtml(text) + '</div>';
          conversationHistory.push({ role: 'user', content: text });
          
          input.value = '';
          messages.scrollTop = messages.scrollHeight;
          
          // Show typing indicator
          const typingDiv = document.createElement('div');
          typingDiv.className = 'message bot';
          typingDiv.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
          messages.appendChild(typingDiv);
          
          sendBtn.disabled = true;
          
          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                message: text,
                history: conversationHistory.slice(0, -1) // Don't include the message we just sent
              })
            });
            
            typingDiv.remove();
            
            const data = await response.json();
            
            if (data.response) {
              messages.innerHTML += '<div class="message bot">' + escapeHtml(data.response) + '</div>';
              conversationHistory.push({ role: 'assistant', content: data.response });
            }
            
            if (data.leadSaved) {
              messages.innerHTML += '<div class="message info">✅ Your information has been saved to our leads system!</div>';
            }
            
            if (data.testDriveBooked) {
              messages.innerHTML += '<div class="message info">✅ Your test drive appointment has been scheduled!</div>';
            }
          } catch (error) {
            typingDiv.remove();
            messages.innerHTML += '<div class="message bot">❌ Sorry, I had trouble connecting. Please check your internet and try again.</div>';
          }
          
          sendBtn.disabled = false;
          messages.scrollTop = messages.scrollHeight;
        }
        
        function escapeHtml(text) {
          const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
          return text.replace(/[&<>"']/g, m => map[m]);
        }
        
        document.getElementById('input').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
};
