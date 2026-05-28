import { chromium } from 'playwright';
import fs from 'fs';

const SESSION_FILE = 'hillzdealer_session.json';

export async function testHillzDealerLogin(username, password) {
  console.log('Testing HillzDealer login...');

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();

    // Navigate to HillzDealer login
    await page.goto('https://www.hillzdealer.ca/', { waitUntil: 'domcontentloaded' });

    // Look for login elements
    const hasLoginForm = await page.locator('input[type="email"], input[name*="user"]').count() > 0;

    if (!hasLoginForm) {
      console.log('⚠️ Could not find login form - may need manual intervention');
      return { success: false, message: 'Login form not found' };
    }

    // Try to find and fill login credentials
    try {
      await page.fill('input[type="email"]', username);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForNavigation({ timeout: 10000 }).catch(() => {});

      const loggedIn = await page.locator('text=Inventory|Dashboard|My Listings').count() > 0;

      if (loggedIn) {
        console.log('✅ HillzDealer login successful');
        return { success: true, message: 'Login successful' };
      }
    } catch (e) {
      console.log('ℹ️ Manual login flow detected - saving session for use');
    }

    return { success: false, message: 'Could not verify login' };
  } finally {
    await browser.close();
  }
}

export async function checkHillzDealerAPI() {
  console.log('Checking for HillzDealer API...');

  try {
    const response = await fetch('https://api.hillzdealer.ca/v1/inventory', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }).catch(() => null);

    if (response && response.ok) {
      console.log('✅ HillzDealer API found!');
      return { hasAPI: true, endpoint: 'https://api.hillzdealer.ca/v1' };
    }
  } catch (e) {
    console.log('ℹ️ HillzDealer API not accessible');
  }

  console.log('ℹ️ Will use web scraping for inventory');
  return { hasAPI: false, message: 'Will use web scraping' };
}

export async function getInventoryFromHillzDealer(username, password) {
  console.log('Fetching inventory from HillzDealer...');

  const browser = await chromium.launch({ headless: true });
  const inventory = [];

  try {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();

    // Navigate to inventory page
    await page.goto('https://www.hillzdealer.ca/inventory', { waitUntil: 'domcontentloaded' });

    // Extract vehicle listings
    const vehicles = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('[data-vehicle], .vehicle-listing, .inventory-item').forEach(el => {
        const vehicleData = {
          title: el.querySelector('h2, h3, .title')?.textContent?.trim() || '',
          price: el.querySelector('.price, [data-price]')?.textContent?.trim() || '',
          mileage: el.querySelector('.mileage, [data-mileage]')?.textContent?.trim() || '',
          description: el.textContent?.trim() || '',
          link: el.querySelector('a')?.href || ''
        };

        if (vehicleData.title) items.push(vehicleData);
      });
      return items;
    });

    console.log(`Found ${vehicles.length} vehicles`);
    return vehicles;
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}
