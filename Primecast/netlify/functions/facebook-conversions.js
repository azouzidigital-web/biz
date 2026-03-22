const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Facebook Conversions API configuration
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || '4203576886543737';
const FACEBOOK_API_VERSION = 'v21.0';

function hashData(data) {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!event.body) {
      console.error('No request body provided');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No request body provided' })
      };
    }

    console.log('Received request body:', event.body);
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { eventName, eventData, userData } = parsedBody;
    
    if (!eventName || !eventData || !userData) {
      console.error('Missing required fields in request body:', { eventName, eventData, userData });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing required fields in request body' })
      };
    }

    if (!FACEBOOK_ACCESS_TOKEN) {
      console.error('Facebook access token not configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Facebook access token not configured' })
      };
    }

    // Validate pixel ID format
    if (!/^\d{13,16}$/.test(FACEBOOK_PIXEL_ID)) {
      console.error('Invalid Facebook Pixel ID format:', FACEBOOK_PIXEL_ID);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid Facebook Pixel ID format' })
      };
    }

    // Generate unique event ID if not provided
    const eventId = eventData.event_id || crypto.randomUUID();

    // Prepare conversion data
    const conversionData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: eventData.source_url || 'https://primmecast.site',
      event_id: eventId,
      user_data: {},
      custom_data: eventData.custom_data || {}
    };

    // Hash and add user data
    if (userData.email) {
      conversionData.user_data.em = [hashData(userData.email)];
    }
    
    if (userData.phone) {
      conversionData.user_data.ph = [hashData(userData.phone)];
    }
    
    if (userData.firstName) {
      conversionData.user_data.fn = [hashData(userData.firstName)];
    }
    
    if (userData.lastName) {
      conversionData.user_data.ln = [hashData(userData.lastName)];
    }

    // Add non-hashed data
    if (userData.clientIp) {
      conversionData.user_data.client_ip_address = userData.clientIp;
    }
    
    if (userData.userAgent) {
      conversionData.user_data.client_user_agent = userData.userAgent;
    }

    console.log('Sending conversion data:', JSON.stringify(conversionData, null, 2));

    const url = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${FACEBOOK_PIXEL_ID}/events`;
    const requestBody = {
      data: [conversionData],
      test_event_code: process.env.NODE_ENV === 'development' ? process.env.FACEBOOK_TEST_EVENT_CODE : undefined,
    };

    console.log('Making request to:', url);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    console.log('Using access token:', `${FACEBOOK_ACCESS_TOKEN.substring(0, 10)}...`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Test event code:', process.env.FACEBOOK_TEST_EVENT_CODE ? 'Present' : 'Not set');

    // Send to Facebook Conversions API
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
      console.error('Facebook Conversions API error:', result);
      // Log additional details for debugging
      console.error('Response status:', response.status);
      console.error('Response headers:', response.headers);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Failed to send conversion event', details: result })
      };
    }

    console.log('Conversion event sent successfully:', result);
    
    // Check for warnings or issues in the response
    if (result.messages && result.messages.length > 0) {
      console.warn('Facebook API warnings:', result.messages);
    }
    
    // Log match quality information if available
    if (result.num_processed_entries !== undefined) {
      console.log('Events processed:', result.num_processed_entries);
    }
    
    // Log any warnings or issues
    if (result.messages && result.messages.length > 0) {
      console.warn('Facebook API messages:', result.messages);
    }
    
    // Check for data processing issues
    if (result.events_received !== 1) {
      console.warn('Unexpected events_received count:', result.events_received);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ success: true, result, eventId })
    };
  } catch (error) {
    console.error('Error sending conversion event:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
