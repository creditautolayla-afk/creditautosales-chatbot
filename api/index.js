export default async (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Credit Auto Sales Chatbot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .chat-box { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; height: 600px; }
        .chat-header { background: #003d82; color: white; padding: 20px; text-align: center; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .message { padding: 12px 16px; border-radius: 8px; max-width: 80%; }
        .message.user { background: #003d82; color: white; align-self: flex-end; }
        .message.bot { background: #e8e8e8; color: #333; }
        .chat-input { display: flex; gap: 10px; padding: 20px; border-top: 1px solid #ddd; }
        .chat-input input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        .chat-input button { padding: 12px 24px; background: #003d82; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .chat-input button:hover { background: #002a5c; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="chat-box">
          <div class="chat-header">
            <h2>Credit Auto Sales</h2>
            <p>AI Assistant</p>
          </div>
          <div class="chat-messages" id="messages">
            <div class="message bot">Hello! 👋 I'm here to help you find the perfect vehicle at Credit Auto Sales. How can I assist you today?</div>
          </div>
          <div class="chat-input">
            <input type="text" id="input" placeholder="Type your message..." />
            <button onclick="sendMessage()">Send</button>
          </div>
        </div>
      </div>

      <script>
        async function sendMessage() {
          const input = document.getElementById('input');
          const messages = document.getElementById('messages');
          const text = input.value.trim();
          
          if (!text) return;
          
          messages.innerHTML += '<div class="message user">' + text + '</div>';
          input.value = '';
          messages.scrollTop = messages.scrollHeight;
          
          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            if (data.response) {
              messages.innerHTML += '<div class="message bot">' + data.response + '</div>';
            } else {
              messages.innerHTML += '<div class="message bot">Sorry, I couldn\\'t process that.</div>';
            }
          } catch (error) {
            messages.innerHTML += '<div class="message bot">Connection error.</div>';
          }
          
          messages.scrollTop = messages.scrollHeight;
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
