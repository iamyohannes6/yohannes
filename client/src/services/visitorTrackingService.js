const DEBUG = true;

const debug = (...args) => {
  if (DEBUG) {
    console.log('🔍 [Visitor Tracking]:', ...args);
  }
};

const TELEGRAM_BOT_TOKEN = '8123027131:AAGiTE410dMvws9ew8BFec1FSDutOIXdvb4';
const TELEGRAM_GROUP_ID = '-1002304701974';

const sendTelegramNotification = async (message) => {
  try {
    debug('Sending notification with message:', message);
    debug('Calling API endpoint:', '/.netlify/functions/sendTelegramMessage');

    const response = await fetch('/.netlify/functions/sendTelegramMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    debug('Response status:', response.status);
    debug('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    debug('Response data:', data);
    
    if (!response.ok) {
      console.error('❌ Error sending notification:', data);
      return false;
    }
    
    debug('✅ Notification sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    debug('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
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
  debug('Time info:', { timeString, timezone });
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
  
  debug('Browser info:', { userAgent, detected: browser });
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
  
  debug('OS info:', { userAgent, detected: os });
  return os;
};

const isReturningVisitor = () => {
  const hasVisited = localStorage.getItem('hasVisitedBefore');
  const isReturning = !!hasVisited;
  debug('Visitor status:', isReturning ? 'Returning' : 'New');
  
  if (!hasVisited) {
    localStorage.setItem('hasVisitedBefore', 'true');
    debug('Set hasVisitedBefore in localStorage');
  }
  
  return isReturning;
};

const trackPageVisit = async (pageName) => {
  debug('Tracking page visit:', pageName);
  
  const time = getTimeWithLocation();
  const browser = getBrowserInfo();
  const os = getOperatingSystem();
  const visitorType = isReturningVisitor() ? 'Returning' : 'New';

  const message = `🌐 New Portfolio Visit\n\n📍 Page: ${pageName}\n⏰ Time: ${time}\n🔍 Browser: ${browser}\n💻 OS: ${os}\n👤 Visitor: ${visitorType} visitor`;
  
  debug('Prepared message:', message);
  const result = await sendTelegramNotification(message);
  debug('Tracking result:', result ? 'Success' : 'Failed');
  
  return result;
};

export { trackPageVisit }; 