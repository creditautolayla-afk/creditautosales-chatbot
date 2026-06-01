let cachedInventory = null;
let cacheTime = 0;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const now = Date.now();
    const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

    // Return cached inventory if still valid
    if (cachedInventory && (now - cacheTime) < CACHE_DURATION) {
      res.status(200).json({ vehicles: cachedInventory });
      return;
    }

    // Try to fetch from HillzDealer API
    let vehicles = [];
    try {
      const auth = Buffer.from(
        `${process.env.HILLZDEALER_USERNAME}:${process.env.HILLZDEALER_PASSWORD}`
      ).toString('base64');

      const hillzRes = await Promise.race([
        fetch('https://api.hillzdealer.ca/v1/inventory', {
          headers: { 'Authorization': `Basic ${auth}` }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);

      if (hillzRes.ok) {
        const data = await hillzRes.json();
        vehicles = Array.isArray(data) ? data : data.vehicles || [];
      }
    } catch (err) {
      console.log('HillzDealer API failed:', err.message);
    }

    // If no vehicles from API, use fallback
    if (vehicles.length === 0) {
      vehicles = [
        { year: 2023, make: 'Toyota', model: 'Camry', price: 28000, color: 'Silver' },
        { year: 2022, make: 'Honda', model: 'Accord', price: 26000, color: 'Blue' },
        { year: 2023, make: 'Mazda', model: 'CX-5', price: 32000, color: 'Red' },
        { year: 2022, make: 'Hyundai', model: 'Elantra', price: 22000, color: 'White' }
      ];
    }

    // Cache the inventory
    cachedInventory = vehicles;
    cacheTime = now;

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error('Inventory error:', error);
    res.status(500).json({ error: 'Internal server error', vehicles: [] });
  }
}
