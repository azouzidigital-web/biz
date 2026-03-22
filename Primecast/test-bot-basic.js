#!/usr/bin/env node

/**
 * Basic Bot Test Script
 * Tests simple bot patterns that should be blocked
 */

const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:9003';

console.log('🤖 Starting Basic Bot Tests...\n');

// Test 1: User Agent Bot Detection
console.log('Test 1: Bot User Agent');
try {
  const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/subscribe" -H "User-Agent: bot-crawler/1.0"`, { encoding: 'utf8' });
  console.log(`Status: ${result.trim()} ${result.trim() === '403' ? '✅ BLOCKED' : '❌ NOT BLOCKED'}`);
} catch (error) {
  console.log('❌ Request failed');
}

// Test 2: Python Bot User Agent
console.log('\nTest 2: Python Bot User Agent');
try {
  const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/subscribe" -H "User-Agent: python-requests/2.28.1"`, { encoding: 'utf8' });
  console.log(`Status: ${result.trim()} ${result.trim() === '403' ? '✅ BLOCKED' : '❌ NOT BLOCKED'}`);
} catch (error) {
  console.log('❌ Request failed');
}

// Test 3: Selenium User Agent
console.log('\nTest 3: Selenium User Agent');
try {
  const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/subscribe" -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36"`, { encoding: 'utf8' });
  console.log(`Status: ${result.trim()} ${result.trim() === '403' ? '✅ BLOCKED' : '❌ NOT BLOCKED'}`);
} catch (error) {
  console.log('❌ Request failed');
}

// Test 4: Missing Headers
console.log('\nTest 4: Missing Headers (No Accept-Language)');
try {
  const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/subscribe" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"`, { encoding: 'utf8' });
  console.log(`Status: ${result.trim()}`);
} catch (error) {
  console.log('❌ Request failed');
}

// Test 5: Rate Limiting
console.log('\nTest 5: Rate Limiting (20 rapid requests)');
let blockedCount = 0;
for (let i = 0; i < 20; i++) {
  try {
    const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/subscribe"`, { encoding: 'utf8' });
    if (result.trim() === '429') {
      blockedCount++;
    }
  } catch (error) {
    // Ignore errors for this test
  }
}
console.log(`Rate limited requests: ${blockedCount}/20 ${blockedCount > 0 ? '✅ WORKING' : '❌ NOT WORKING'}`);

// Test 6: Normal Browser (Should Pass)
console.log('\nTest 6: Normal Browser Headers (Should Pass)');
try {
  const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/subscribe" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" -H "Accept-Language: en-US,en;q=0.5" -H "Accept-Encoding: gzip, deflate"`, { encoding: 'utf8' });
  console.log(`Status: ${result.trim()} ${result.trim() === '200' ? '✅ ALLOWED' : '❌ BLOCKED'}`);
} catch (error) {
  console.log('❌ Request failed');
}

console.log('\n🏁 Basic Bot Tests Complete!');
