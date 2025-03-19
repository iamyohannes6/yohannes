const TELEGRAM_BOT_TOKEN = '8123027131:AAGiTE410dMvws9ew8BFec1FSDutOIXdvb4';
const TELEGRAM_GROUP_ID = '-1002304701974';

const sendTelegramNotification = async (message) => {
  try {
    const response = await fetch('/.netlify/functions/sendTelegramMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error sending notification:', data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
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

  const message = `🌐 New Portfolio Visit\n\n📍 Page: ${pageName}\n⏰ Time: ${time}\n🔍 Browser: ${browser}\n💻 OS: ${os}\n👤 Visitor: ${visitorType} visitor`;

  await sendTelegramNotification(message);
};

export { trackPageVisit }; 