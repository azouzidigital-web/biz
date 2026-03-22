#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:9003';

async function testBasicBot() {
  console.log('🤖 Testing Basic Bot Protection...\n');

  // Test 1: Bot User Agent
  console.log('Test 1: Bot User Agent');
  try {
    const response = await axios.get(`${BASE_URL}/subscribe`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    console.log(`❌ Bot passed (Status: ${response.status}) - This should be blocked!`);
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Bot blocked successfully (403 Forbidden)');
    } else {
      console.log(`⚠️  Unexpected response: ${error.response?.status || 'Network Error'}`);
    }
  }

  // Test 2: Obvious Bot Pattern
  console.log('\nTest 2: Obvious Bot Pattern');
  try {
    const response = await axios.get(`${BASE_URL}/subscribe`, {
      headers: {
        'User-Agent': 'python-requests/2.25.1'
      }
    });
    console.log(`❌ Python bot passed (Status: ${response.status}) - This should be blocked!`);
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Python bot blocked successfully (403 Forbidden)');
    } else {
      console.log(`⚠️  Unexpected response: ${error.response?.status || 'Network Error'}`);
    }
  }

  // Test 3: Missing Headers
  console.log('\nTest 3: Missing Headers');
  try {
    const response = await axios.get(`${BASE_URL}/subscribe`, {
      headers: {
        'User-Agent': 'curl/7.68.0'
      }
    });
    console.log(`❌ cURL passed (Status: ${response.status}) - This should be blocked!`);
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ cURL blocked successfully (403 Forbidden)');
    } else {
      console.log(`⚠️  Unexpected response: ${error.response?.status || 'Network Error'}`);
    }
  }

  // Test 4: Normal Browser (Should Pass)
  console.log('\nTest 4: Normal Browser (Should Pass)');
  try {
    const response = await axios.get(`${BASE_URL}/subscribe`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': `${BASE_URL}/`
      }
    });
    console.log(`✅ Normal browser passed (Status: ${response.status})`);
  } catch (error) {
    console.log(`❌ Normal browser blocked (Status: ${error.response?.status}) - This should pass!`);
  }
}

// Run the test
testBasicBot().catch(console.error);
