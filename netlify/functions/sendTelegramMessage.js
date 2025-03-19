const fetch = require('node-fetch');

const TELEGRAM_BOT_TOKEN = '8123027131:AAGiTE410dMvws9ew8BFec1FSDutOIXdvb4';
const TELEGRAM_GROUP_ID = '-1002304701974';

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

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_GROUP_ID,
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending notification', error: error.message })
    };
  }
}; 