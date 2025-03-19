const TELEGRAM_BOT_TOKEN = '8123027131:AAGiTE410dMvws9ew8BFec1FSDutOIXdvb4';
const TELEGRAM_GROUP_ID = '-1002304701974';

const sendTelegramNotification = async (message) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
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
    
    if (!response.ok) {
      console.error('Telegram API Error:', data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

const getTimeWithLocation = () => {
  const options = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const timeString = new Date().toLocaleString(undefined, options);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${timeString} (${timezone})`;
};

const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  
  if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Chrome")) {
    browser = "Chrome";
  } else if (userAgent.includes("Safari")) {
    browser = "Safari";
  } else if (userAgent.includes("Edge")) {
    browser = "Edge";
  } else if (userAgent.includes("Opera")) {
    browser = "Opera";
  }
  
  return browser;
};

const getOperatingSystem = () => {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac")) {
    os = "MacOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iOS")) {
    os = "iOS";
  }
  
  return os;
};

const isReturningVisitor = () => {
  const hasVisited = localStorage.getItem('hasVisitedBefore');
  if (!hasVisited) {
    localStorage.setItem('hasVisitedBefore', 'true');
    return false;
  }
  return true;
};

const trackPageVisit = async (pageName) => {
  const time = getTimeWithLocation();
  const browser = getBrowserInfo();
  const os = getOperatingSystem();
  const visitorType = isReturningVisitor() ? 'Returning' : 'New';

  const message = `New Portfolio Visit\n\nPage: ${pageName}\nTime: ${time}\nBrowser: ${browser}\nOS: ${os}\nVisitor: ${visitorType} visitor`;

  await sendTelegramNotification(message);
};

export { trackPageVisit }; 