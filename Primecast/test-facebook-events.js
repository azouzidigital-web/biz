const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Facebook Conversions API configuration
const FACEBOOK_ACCESS_TOKEN = 'EAAeVAh6ncjcBPK8k0BZCFIiTL2zxQtWhU4XQrpNNTvpwyqzNgWWowrQawdYcMLWPFQ6FBDTFZBvFH1rokYCZAFVGHu7DncEiZBy9cbdCZBwcYJJmt8rhpZBmxtfN2uA2X4OZBA4tZCPMKPPcLM1qAlwZCdgHq0THtIpTCDPlZAwSXQv6WvqfTFVZBZBZBIh3vf7JlKQZDZD';
const FACEBOOK_PIXEL_ID = '4203576886543737';
const FACEBOOK_API_VERSION = 'v21.0';

function hashData(data) {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

async function testFacebookEvent() {
  console.log('Testing Facebook Conversions API...');
  
  const eventData = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: 'https://primmecast.site/subscribe/',
    event_id: crypto.randomUUID(),
    user_data: {
      ph: [hashData('1234567890')],
      client_ip_address: '8.8.8.8', // Example IP
      client_user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    custom_data: {
      currency: 'USD',
      value: '69',
      content_name: 'Digital Service - 12 months',
      content_category: 'Digital Services'
    }
  };

  const requestBody = {
    data: [eventData],
    test_event_code: 'TEST12345'
  };

  console.log('Sending test event:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${FACEBOOK_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook API Error:', result);
      return;
    }

    console.log('✅ Test event sent successfully!');
    console.log('Response:', result);
    
    if (result.messages && result.messages.length > 0) {
      console.log('📝 Messages:', result.messages);
    }

    // Test PageView event too
    console.log('\n---\nTesting PageView event...');
    
    const pageViewData = {
      event_name: 'PageView',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: 'https://primmecast.site/',
      event_id: crypto.randomUUID(),
      user_data: {
        client_ip_address: '8.8.8.8',
        client_user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      }
    };

    const pageViewRequest = {
      data: [pageViewData],
      test_event_code: 'TEST12345'
    };

    const pageViewResponse = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${FACEBOOK_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(pageViewRequest),
      }
    );

    const pageViewResult = await pageViewResponse.json();

    if (!pageViewResponse.ok) {
      console.error('PageView API Error:', pageViewResult);
      return;
    }

    console.log('✅ PageView test event sent successfully!');
    console.log('Response:', pageViewResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

testFacebookEvent();
