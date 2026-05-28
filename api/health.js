export default (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
};
export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.json({ status: 'ok', time: new Date().toISOString() });
};
// Updated for fresh deployment
