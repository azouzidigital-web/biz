#!/usr/bin/env node

/**
 * Form Submission Bot Test
 * Tests form-specific protections like honeypots and timing
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:9003';

class FormBot {
  constructor() {
    this.results = {
      honeypotTests: 0,
      timingTests: 0,
      captchaTests: 0,
      behaviorTests: 0,
      totalBlocked: 0
    };
  }

  async testHoneypotTrigger() {
    console.log('🍯 Test: Honeypot Field Trigger');
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.goto(`${BASE_URL}/subscribe`);
      
      // Fill visible fields normally
      await page.type('input[name="name"]', 'Honeypot Bot');
      await page.type('input[name="email"]', 'honeypot@bot.com');
      await page.type('input[name="whatsapp"]', '1234567890');
      
      // Fill honeypot fields (this should trigger protection)
      await page.evaluate(() => {
        // Find and fill all potential honeypot fields
        const honeypotSelectors = [
          'input[name="website"]',
          'input[name="company"]',
          'input[name="phone2"]',
          'input[name="email2"]',
          'input[name="address"]',
          'input[name="city"]',
          'input[name="fax"]'
        ];
        
        honeypotSelectors.forEach(selector => {
          const field = document.querySelector(selector);
          if (field) {
            field.value = 'honeypot-triggered';
            console.log('Filled honeypot field:', selector);
          }
        });
      });
      
      // Try to submit
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Check if blocked
      const isBlocked = await page.evaluate(() => {
        return document.body.innerText.includes('blocked') || 
               document.body.innerText.includes('denied') ||
               window.location.href.includes('error');
      });
      
      this.results.honeypotTests++;
      if (isBlocked) this.results.totalBlocked++;
      
      console.log(`Result: ${isBlocked ? '✅ BLOCKED' : '❌ NOT BLOCKED'}`);
      
      await browser.close();
      return isBlocked;
    } catch (error) {
      console.log('❌ Test failed:', error.message);
      return false;
    }
  }

  async testRapidSubmission() {
    console.log('\n⚡ Test: Rapid Form Submission');
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/subscribe`);
      
      // Fill and submit as fast as possible
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          const inputs = form.querySelectorAll('input');
          inputs.forEach(input => {
            if (input.name === 'name') input.value = 'Speed Bot';
            if (input.name === 'email') input.value = 'speed@bot.com';
            if (input.name === 'whatsapp') input.value = '9876543210';
          });
          
          const select = form.querySelector('select[name="months"]');
          if (select) select.value = '12';
        }
      });
      
      await page.click('button[type="submit"]');
      
      const submitTime = Date.now() - startTime;
      console.log(`Submission time: ${submitTime}ms`);
      
      await page.waitForTimeout(3000);
      
      // Check for timing-based blocking
      const alerts = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*')).some(el => 
          el.textContent.includes('take your time') || 
          el.textContent.includes('too fast') ||
          el.textContent.includes('slow down')
        );
      });
      
      this.results.timingTests++;
      if (alerts || submitTime < 2000) this.results.totalBlocked++;
      
      console.log(`Result: ${alerts ? '✅ TIMING PROTECTION ACTIVE' : '❌ NO TIMING PROTECTION'}`);
      
      await browser.close();
      return alerts;
    } catch (error) {
      console.log('❌ Test failed:', error.message);
      return false;
    }
  }

  async testNoInteractionSubmission() {
    console.log('\n🖱️ Test: No Mouse/Keyboard Interaction');
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.goto(`${BASE_URL}/subscribe`);
      
      // Fill form using only JavaScript (no user interaction events)
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          // Directly set values without triggering events
          const nameInput = form.querySelector('input[name="name"]');
          const emailInput = form.querySelector('input[name="email"]');
          const whatsappInput = form.querySelector('input[name="whatsapp"]');
          const monthsSelect = form.querySelector('select[name="months"]');
          
          if (nameInput) nameInput.value = 'No Interaction Bot';
          if (emailInput) emailInput.value = 'nointeraction@bot.com';
          if (whatsappInput) whatsappInput.value = '5555555555';
          if (monthsSelect) monthsSelect.value = '6';
        }
      });
      
      // Wait a bit (but no interaction)
      await page.waitForTimeout(3000);
      
      // Submit via JavaScript
      await page.evaluate(() => {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) submitButton.click();
      });
      
      await page.waitForTimeout(3000);
      
      // Check for behavioral blocking
      const behaviorBlocked = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*')).some(el => 
          el.textContent.includes('interact') || 
          el.textContent.includes('mouse') ||
          el.textContent.includes('behavior')
        );
      });
      
      this.results.behaviorTests++;
      if (behaviorBlocked) this.results.totalBlocked++;
      
      console.log(`Result: ${behaviorBlocked ? '✅ BEHAVIOR DETECTION ACTIVE' : '❌ NO BEHAVIOR DETECTION'}`);
      
      await browser.close();
      return behaviorBlocked;
    } catch (error) {
      console.log('❌ Test failed:', error.message);
      return false;
    }
  }

  async testCaptchaEvasion() {
    console.log('\n🔐 Test: CAPTCHA Trigger and Response');
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Set suspicious user agent to trigger CAPTCHA
      await page.setUserAgent('SuspiciousBot/1.0 (Automated)');
      
      await page.goto(`${BASE_URL}/subscribe`);
      await page.waitForTimeout(2000);
      
      // Check if CAPTCHA appears
      const captchaVisible = await page.evaluate(() => {
        return !!document.querySelector('[class*="captcha"], [id*="captcha"], [class*="verification"]');
      });
      
      console.log(`CAPTCHA triggered: ${captchaVisible ? '✅ YES' : '❌ NO'}`);
      
      if (captchaVisible) {
        // Try to solve CAPTCHA too quickly (bot behavior)
        await page.evaluate(() => {
          const inputs = document.querySelectorAll('input[type="text"]');
          inputs.forEach(input => {
            if (input.placeholder && input.placeholder.includes('answer')) {
              input.value = '42'; // Generic answer
            }
          });
        });
        
        await page.click('button:contains("Verify"), button:contains("Submit")');
        await page.waitForTimeout(1000);
        
        // Check if fast response was detected
        const fastResponseDetected = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('*')).some(el => 
            el.textContent.includes('take your time') || 
            el.textContent.includes('too fast')
          );
        });
        
        console.log(`Fast CAPTCHA response detected: ${fastResponseDetected ? '✅ YES' : '❌ NO'}`);
        this.results.captchaTests++;
        if (fastResponseDetected) this.results.totalBlocked++;
      }
      
      await browser.close();
      return captchaVisible;
    } catch (error) {
      console.log('❌ Test failed:', error.message);
      return false;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 Form Bot Test Summary:');
    console.log(`Honeypot Tests: ${this.results.honeypotTests}`);
    console.log(`Timing Tests: ${this.results.timingTests}`);
    console.log(`Behavior Tests: ${this.results.behaviorTests}`);
    console.log(`CAPTCHA Tests: ${this.results.captchaTests}`);
    console.log(`Total Blocked: ${this.results.totalBlocked}`);
    
    const totalTests = this.results.honeypotTests + this.results.timingTests + 
                      this.results.behaviorTests + this.results.captchaTests;
    
    if (totalTests > 0) {
      const protectionRate = (this.results.totalBlocked / totalTests) * 100;
      console.log(`\nForm Protection Rate: ${protectionRate.toFixed(1)}%`);
      
      if (protectionRate >= 80) {
        console.log('🛡️ EXCELLENT FORM PROTECTION');
      } else if (protectionRate >= 60) {
        console.log('⚠️ MODERATE FORM PROTECTION');
      } else {
        console.log('❌ WEAK FORM PROTECTION');
      }
    }
  }
}

async function runFormBotTests() {
  console.log('📝 Starting Form Bot Tests...\n');
  
  const formBot = new FormBot();
  
  await formBot.testHoneypotTrigger();
  await formBot.testRapidSubmission();
  await formBot.testNoInteractionSubmission();
  await formBot.testCaptchaEvasion();
  
  formBot.printSummary();
  
  console.log('\n🏁 Form Bot Tests Complete!');
}

// Check if puppeteer is available and run tests
if (require.main === module) {
  runFormBotTests().catch(console.error);
}

module.exports = { FormBot, runFormBotTests };
