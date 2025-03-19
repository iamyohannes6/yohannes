const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Message is required' })
      };
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
      console.error('Missing Telegram configuration');
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Server configuration error' })
      };
    }

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API Error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Error sending to Telegram', error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending notification', error: error.message })
    };
  }
}; 