export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.url === '/health' || req.url === '/api/health') {
    res.json({ status: 'ok', time: new Date().toISOString() });
    return;
  }

  if (req.url === '/dealership' || req.url === '/api/dealership') {
    res.json({
      name: "Credit Auto Sales",
      address: "1275 finch ave w",
      phone: "4377576977",
      email: "creditautonow@gmail.com"
    });
    return;
  }

  res.status(404).json({ error: 'Not found' });
};

