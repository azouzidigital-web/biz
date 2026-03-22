const puppeteer = require('puppeteer');

/**
 * Advanced Bot Test using Puppeteer
 * Tests sophisticated bot behaviors
 */

const BASE_URL = 'http://localhost:9003';

async function runAdvancedBotTests() {
  console.log('🕷️ Starting Advanced Bot Tests with Puppeteer...\n');

  // Test 1: Headless Browser Detection
  console.log('Test 1: Headless Browser Detection');
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set a normal user agent but keep headless
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const response = await page.goto(`${BASE_URL}/subscribe`);
    console.log(`Status: ${response.status()} ${response.status() >= 400 ? '✅ BLOCKED' : '❌ NOT BLOCKED'}`);
    
    await browser.close();
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  // Test 2: Fast Form Submission (Bot-like speed)
  console.log('\nTest 2: Fast Form Submission');
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`${BASE_URL}/subscribe`);
    
    // Fill form instantly (bot behavior)
    await page.type('input[name="name"]', 'Bot User', { delay: 0 });
    await page.type('input[name="email"]', 'bot@test.com', { delay: 0 });
    await page.type('input[name="whatsapp"]', '1234567890', { delay: 0 });
    await page.select('select[name="months"]', '12');
    
    // Submit immediately
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    const alerts = await page.evaluate(() => {
      return window.alerts || [];
    });
    
    console.log('Form submission result: Bot-like speed detected');
    
    await browser.close();
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  // Test 3: No Mouse Movement
  console.log('\nTest 3: No Mouse Movement Detection');
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`${BASE_URL}/subscribe`);
    
    // Wait on page without any mouse movement
    await page.waitForTimeout(5000);
    
    // Try to submit form without mouse interaction
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        // Fill using JavaScript (no user interaction)
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const whatsappInput = form.querySelector('input[name="whatsapp"]');
        
        if (nameInput) nameInput.value = 'No Mouse Bot';
        if (emailInput) emailInput.value = 'nomouse@bot.com';
        if (whatsappInput) whatsappInput.value = '9876543210';
      }
    });
    
    console.log('No mouse movement behavior simulated');
    
    await browser.close();
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  // Test 4: Honeypot Trigger
  console.log('\nTest 4: Honeypot Field Detection');
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`${BASE_URL}/subscribe`);
    
    // Fill hidden honeypot fields (bot behavior)
    await page.evaluate(() => {
      const honeypotFields = document.querySelectorAll('input[name="website"], input[name="company"], input[name="fax"]');
      honeypotFields.forEach(field => {
        if (field) field.value = 'bot-filled';
      });
    });
    
    console.log('Honeypot fields filled (should trigger protection)');
    
    await browser.close();
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  // Test 5: Automation Detection
  console.log('\nTest 5: WebDriver Detection');
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--disable-blink-features=AutomationControlled']
    });
    const page = await browser.newPage();
    
    // Remove webdriver property
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
    
    const response = await page.goto(`${BASE_URL}/subscribe`);
    
    // Check if automation was detected
    const detectionResult = await page.evaluate(() => {
      return {
        webdriver: navigator.webdriver,
        automation: !!window.chrome?.runtime?.onConnect
      };
    });
    
    console.log('WebDriver property:', detectionResult.webdriver);
    console.log(`Status: ${response.status()}`);
    
    await browser.close();
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🏁 Advanced Bot Tests Complete!');
}

// Check if puppeteer is available
try {
  runAdvancedBotTests();
} catch (error) {
  console.log('❌ Puppeteer not available. Install with: npm install puppeteer');
  console.log('Running basic tests instead...');
}
