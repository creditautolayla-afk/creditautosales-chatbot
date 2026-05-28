export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { message } = req.body;
    res.json({ response: `Thanks for asking: "${message}". We'll connect you with our team shortly!` });
  } catch (e) {
    res.json({ response: "Thanks for reaching out! Our team will help you find the perfect vehicle." });
  }
};
