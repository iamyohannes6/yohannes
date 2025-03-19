const fetch = require('node-fetch');

const debug = (...args) => {
  console.log('🔧 [Netlify Function]:', ...args);
};

exports.handler = async function(event, context) {
  debug('Function invoked with event:', {
    httpMethod: event.httpMethod,
    headers: event.headers,
    path: event.path,
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    debug('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    debug('Parsing request body');
    const { message } = JSON.parse(event.body);

    if (!message) {
      debug('Message is missing in request');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Message is required' })
      };
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

    debug('Checking environment variables:', {
      hasBotToken: !!TELEGRAM_BOT_TOKEN,
      hasGroupId: !!TELEGRAM_GROUP_ID,
    });

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      debug('Missing environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Server configuration error',
          details: {
            hasBotToken: !!TELEGRAM_BOT_TOKEN,
            hasGroupId: !!TELEGRAM_GROUP_ID,
          }
        })
      };
    }

    debug('Sending request to Telegram API');
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    debug('Telegram API URL:', telegramUrl);

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_GROUP_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    debug('Telegram API response:', {
      status: response.status,
      data: data,
    });

    if (!response.ok) {
      debug('Telegram API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          message: 'Error sending to Telegram', 
          error: data,
          status: response.status,
        })
      };
    }

    debug('Message sent successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    debug('Function error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error sending notification', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      })
    };
  }
}; 