// Pinterest Image Scraper Content Script
(function() {
  // Logging utility
  const Logger = {
    log: (message) => console.log(`[Pinterest Downloader] ${message}`),
    error: (message) => console.error(`[Pinterest Downloader] ${message}`)
  };

  // Image extraction logic
  function extractPinterestImages() {
    // Select all image elements on the page
    const images = Array.from(document.querySelectorAll('img'))
      .map(img => img.src)
      .filter(src => 
        src.startsWith('https://') && 
        (src.includes('pinimg.com') || src.includes('pinterest.com'))
      );

    // Remove duplicates
    return [...new Set(images)];
  }

  // Listen for messages from popup or background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'scanImages') {
        // Scroll to bottom to load more images
        window.scrollTo(0, document.body.scrollHeight);
        
        // Wait a bit for images to load
        setTimeout(() => {
          const images = extractPinterestImages();
          
          Logger.log(`Found ${images.length} images`);
          
          sendResponse({
            success: true,
            images: images
          });
        }, 2000);  // 2-second delay to allow image loading
        
        // Indicate async response
        return true;
      }
    } catch (error) {
      Logger.error(`Error in content script: ${error.message}`);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  });

  // Log when content script is injected
  Logger.log('Content script initialized');
})();
