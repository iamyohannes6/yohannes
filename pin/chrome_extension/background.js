// Logging utility
const Logger = {
  log: (message, level = 'INFO') => {
    const timestamp = new Date().toISOString();
    console.log(`[${level}] ${timestamp}: ${message}`);
    
    // Store logs in chrome.storage for debugging
    chrome.storage.local.get(['logs'], (result) => {
      const logs = result.logs || [];
      logs.push(`[${level}] ${timestamp}: ${message}`);
      
      // Keep only last 100 logs to prevent storage overflow
      if (logs.length > 100) {
        logs.shift();
      }
      
      chrome.storage.local.set({ logs: logs });
    });
  },
  error: (message) => Logger.log(message, 'ERROR'),
  debug: (message) => Logger.log(message, 'DEBUG'),
  warn: (message) => Logger.log(message, 'WARN')
};

// Image filtering utility
const ImageFilter = {
  // Minimum acceptable image dimensions
  MIN_WIDTH: 500,
  MIN_HEIGHT: 500,
  
  // Comprehensive list of patterns to filter out
  INVALID_PATTERNS: [
    // Profile picture patterns
    '/avatars/',
    '/profile_',
    '/user_',
    '/avatar_',
    
    // Very small image sizes
    '/30x30/', '/50x50/', '/60x60/', '/75x75/', 
    '/100x100/', '/140x140/', '/150x150/', '/200x200/',
    
    // Low-resolution indicators
    'small_', 'thumb_', 'thumbnail_', 'preview_',
    
    // Specific Pinterest profile-related patterns
    '/pin/avatar/', '/pin/profile/'
  ],
  
  // Check if an image URL meets quality criteria
  isValidImage(url) {
    // Convert to lowercase for case-insensitive matching
    const lowercaseUrl = url.toLowerCase();
    
    // Aggressive check for small images
    if (/\/(140x140|150x150|200x200)\//.test(lowercaseUrl)) {
      return false;
    }
    
    // Check against invalid patterns first
    if (this.INVALID_PATTERNS.some(pattern => lowercaseUrl.includes(pattern))) {
      return false;
    }
    
    // Use URL patterns to estimate image size and quality
    return this.checkUrlForSize(url);
  },
  
  // Use URL patterns to estimate image size
  checkUrlForSize(url) {
    // Remove query parameters
    url = url.split('?')[0];
    
    // Check for size-related patterns in URL
    const sizePatterns = [
      // Pinterest image size patterns
      /\/(\d+)x(\d+)\//,  // Match dimensions like 600x400
      /\/originals\//,    // High-resolution images
      /\/full\//          // Full-size images
    ];
    
    for (const pattern of sizePatterns) {
      const match = url.match(pattern);
      if (match) {
        // If specific dimensions found, check against minimum size
        if (match[1] && match[2]) {
          const width = parseInt(match[1]);
          const height = parseInt(match[2]);
          
          // Explicitly reject small images
          if (width < this.MIN_WIDTH || height < this.MIN_HEIGHT) {
            return false;
          }
          
          if (width >= this.MIN_WIDTH && height >= this.MIN_HEIGHT) {
            return true;
          }
        }
        
        // If 'originals' or 'full' is in the URL, it's likely a good image
        if (match[0].includes('originals') || match[0].includes('full')) {
          return true;
        }
      }
    }
    
    // Prioritize high-resolution image URLs
    const highResPatterns = [
      '/originals/',
      '/full/',
      '/large/',
      '/max/'
    ];
    
    if (highResPatterns.some(pattern => url.includes(pattern))) {
      return true;
    }
    
    // Fallback: check file extensions of typical image types
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  },
  
  // Filter and sort images by quality
  filterImages(images) {
    // Filter out invalid images
    const filteredImages = images.filter(url => this.isValidImage(url));
    
    // Sort images, prioritizing high-resolution URLs
    return filteredImages.sort((a, b) => {
      const aScore = this.calculateImageScore(a);
      const bScore = this.calculateImageScore(b);
      return bScore - aScore;
    });
  },
  
  // Calculate a score for image quality
  calculateImageScore(url) {
    let score = 0;
    
    // Bonus points for high-resolution indicators
    const highResBonus = [
      '/originals/',
      '/full/',
      '/large/',
      '/max/'
    ];
    
    highResBonus.forEach(pattern => {
      if (url.includes(pattern)) score += 100;
    });
    
    // Extract dimensions if possible
    const sizeMatch = url.match(/\/(\d+)x(\d+)\//);
    if (sizeMatch) {
      const width = parseInt(sizeMatch[1]);
      const height = parseInt(sizeMatch[2]);
      
      // Explicitly reduce score for small images
      if (width < this.MIN_WIDTH || height < this.MIN_HEIGHT) {
        return -1000; // Ensure these are filtered out
      }
      
      score += Math.min(width, height);
    }
    
    return score;
  }
};

// Download tracking mechanism
const DownloadTracker = {
  // Storage key for tracking downloaded images
  STORAGE_KEY: 'pinterest_downloaded_images',
  
  // Initialize download tracking
  async initialize() {
    // Ensure we have a set of downloaded images
    const result = await chrome.storage.local.get([this.STORAGE_KEY]);
    if (!result[this.STORAGE_KEY]) {
      await chrome.storage.local.set({ 
        [this.STORAGE_KEY]: [] 
      });
    }
  },
  
  // Check if an image has been downloaded
  async isDownloaded(imageUrl) {
    const result = await chrome.storage.local.get([this.STORAGE_KEY]);
    const downloadedImages = result[this.STORAGE_KEY] || [];
    return downloadedImages.includes(imageUrl);
  },
  
  // Mark an image as downloaded
  async markAsDownloaded(imageUrl) {
    const result = await chrome.storage.local.get([this.STORAGE_KEY]);
    const downloadedImages = result[this.STORAGE_KEY] || [];
    
    // Prevent duplicates and limit storage
    if (!downloadedImages.includes(imageUrl)) {
      downloadedImages.push(imageUrl);
      
      // Optionally, limit the number of stored URLs to prevent excessive storage
      const MAX_STORED_IMAGES = 1000;
      if (downloadedImages.length > MAX_STORED_IMAGES) {
        downloadedImages.shift(); // Remove oldest entry
      }
      
      await chrome.storage.local.set({ 
        [this.STORAGE_KEY]: downloadedImages 
      });
    }
  },
  
  // Clear download history (optional)
  async clearDownloadHistory() {
    await chrome.storage.local.set({ 
      [this.STORAGE_KEY]: [] 
    });
  }
};

// Retry mechanism for downloads
const RetryMechanism = {
  maxRetries: 3,
  delay: 1000, // 1 second between retries
  
  async executeWithRetry(fn, ...args) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        Logger.debug(`Attempt ${attempt} of ${this.maxRetries}`);
        return await fn(...args);
      } catch (error) {
        Logger.error(`Attempt ${attempt} failed: ${error.message}`);
        lastError = error;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, this.delay * attempt));
      }
    }
    
    throw lastError;
  }
};

// Enhanced image extraction with multiple strategies
function findImages() {
  const images = new Set();
  const strategies = [
    // Strategy 1: High-resolution image URLs
    () => {
      const highResSelectors = [
        'img[srcset*="originals"]',
        'img[src*="/originals/"]',
        'img[data-src*="/originals/"]'
      ];
      
      highResSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(img => {
          const url = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('srcset');
          if (url) images.add(url.split('?')[0]);
        });
      });
    },
    
    // Strategy 2: Pinterest-specific image patterns
    () => {
      const pinterestSelectors = [
        'div[data-test-id="pin"] img',
        'div[class*="Pin"] img',
        'a[href*="/pin/"] img'
      ];
      
      pinterestSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(img => {
          const url = img.src || img.dataset.src;
          if (url && url.includes('pinimg.com')) images.add(url);
        });
      });
    },
    
    // Strategy 3: Background images
    () => {
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        const backgroundImage = style.backgroundImage;
        if (backgroundImage && backgroundImage !== 'none') {
          const match = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
          if (match && match[1].includes('pinimg.com')) {
            images.add(match[1]);
          }
        }
      });
    }
  ];
  
  // Run all strategies
  strategies.forEach(strategy => strategy());
  
  // Filter and clean URLs
  return Array.from(images)
    .map(url => {
      // Remove query parameters
      url = url.split('?')[0];
      
      // Prioritize high-resolution images
      url = url.replace(/\/\d+x\//, '/originals/');
      
      return url;
    })
    .filter(url => url.includes('pinimg.com'));
}

// Track download progress
let downloadProgress = {
  total: 0,
  completed: 0,
  failed: 0
};

// Enhanced image URL transformation function
function getHighResolutionImageUrl(thumbnailUrl) {
  // Pinterest image URL patterns
  const patterns = [
    // Replace thumbnail sizes with original
    { 
      regex: /\/([0-9]+x)\//, 
      replace: '/originals/' 
    },
    // Replace small image indicators
    { 
      regex: /\/([0-9]+x[0-9]+)\//, 
      replace: '/originals/' 
    },
    // Replace compressed or resized indicators
    { 
      regex: /\/[a-z]+_[0-9]+x[0-9]+\//, 
      replace: '/originals/' 
    },
    // Handle pinimg.com specific transformations
    { 
      regex: /\/([a-z0-9]+)\/([a-z0-9]+)_[a-z]+\.(jpg|png|jpeg|gif)/, 
      replace: '/$1/$2.$3' 
    }
  ];

  let highResUrl = thumbnailUrl;

  // Apply transformations
  patterns.forEach(pattern => {
    if (pattern.regex.test(highResUrl)) {
      highResUrl = highResUrl.replace(pattern.regex, pattern.replace);
    }
  });

  return highResUrl;
}

// Modify downloadImages to use DownloadTracker and ImageFilter
async function downloadImages(images, folderPath) {
  // Initialize download tracking
  await DownloadTracker.initialize();
  
  // Rigorously filter images before downloading
  const validImages = ImageFilter.filterImages(images);
  
  Logger.log(`Starting download of ${validImages.length} filtered images (out of ${images.length} total)`);
  
  // Reset download progress
  downloadProgress = {
    total: validImages.length,
    completed: 0,
    failed: 0
  };
  
  // Filter out already downloaded images
  const imagesToDownload = await Promise.all(
    validImages.map(async (img) => {
      const isDownloaded = await DownloadTracker.isDownloaded(img);
      return isDownloaded ? null : img;
    })
  );
  
  // Remove null entries (already downloaded)
  const filteredImages = imagesToDownload.filter(img => img !== null);
  
  // Update total count
  downloadProgress.total = filteredImages.length;
  
  // Download images
  const downloadPromises = filteredImages.map(async (img) => {
    try {
      // Validate image again before downloading
      if (!ImageFilter.isValidImage(img)) {
        Logger.warn(`Skipping invalid image: ${img}`);
        downloadProgress.failed++;
        return;
      }
      
      // Get high-resolution image URL
      const highResUrl = getHighResolutionImageUrl(img);
      
      // Generate unique filename
      const filename = `${folderPath}/pin_${getFilenameFromUrl(highResUrl)}`;
      
      // Download the image
      const downloadItem = await chrome.downloads.download({
        url: highResUrl,
        filename: filename,
        saveAs: false
      });
      
      // Wait for download to complete
      await new Promise((resolve, reject) => {
        chrome.downloads.onChanged.addListener(function listener(downloadDelta) {
          if (downloadDelta.id === downloadItem && downloadDelta.state) {
            if (downloadDelta.state.current === 'complete') {
              chrome.downloads.onChanged.removeListener(listener);
              
              // Mark as downloaded
              DownloadTracker.markAsDownloaded(highResUrl);
              
              // Update progress
              downloadProgress.completed++;
              resolve();
            } else if (downloadDelta.state.current === 'interrupted') {
              chrome.downloads.onChanged.removeListener(listener);
              downloadProgress.failed++;
              reject(new Error('Download interrupted'));
            }
          }
        });
      });
    } catch (error) {
      Logger.error(`Download failed for ${img}: ${error.message}`);
      downloadProgress.failed++;
    }
  });
  
  // Wait for all downloads to complete
  await Promise.allSettled(downloadPromises);
  
  // Send final notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon128.png',
    title: 'Pinterest Downloader',
    message: `Download complete. ${downloadProgress.completed} images downloaded, ${downloadProgress.failed} failed.`
  });
  
  return downloadProgress;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Wrap all message handling in a try-catch
  try {
    if (request.action === 'scanImages') {
      // Execute script in the active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (chrome.runtime.lastError || !tabs || !tabs.length) {
          sendResponse({
            success: false, 
            error: 'Could not access active tab'
          });
          return;
        }

        const activeTab = tabs[0];
        
        chrome.scripting.executeScript({
          target: {tabId: activeTab.id},
          function: findImages
        }).then(results => {
          if (!results || !results[0] || !results[0].result) {
            sendResponse({
              success: false, 
              error: 'No images found or script execution failed'
            });
            return;
          }

          const images = results[0].result;
          Logger.log(`Found ${images.length} unique images`);
          
          // Ensure response is sent
          sendResponse({
            success: true, 
            images: images
          });
        }).catch(error => {
          Logger.error(`Image scanning failed: ${error.message}`);
          sendResponse({
            success: false, 
            error: error.message || 'Failed to scan images'
          });
        });
      });
      
      // Return true to indicate asynchronous response
      return true;
    }
    
    if (request.action === 'startDownload') {
      const { images, folderPath } = request;
      
      // Start background download process
      downloadImages(images, folderPath)
        .then((progress) => {
          Logger.log('Download process completed successfully');
          sendResponse({ 
            success: true,
            progress: progress
          });
        })
        .catch(error => {
          Logger.error(`Download failed: ${error.message}`);
          sendResponse({ 
            success: false, 
            error: error.message || 'Download failed',
            progress: downloadProgress
          });
        });
      
      // Return true to indicate asynchronous response
      return true;
    }
    
    if (request.action === 'getDownloadProgress') {
      // Send current download progress
      sendResponse(downloadProgress || {
        total: 0,
        completed: 0,
        failed: 0
      });
      return true;
    }
    
    if (request.action === 'getLogs') {
      // Retrieve stored logs for debugging
      chrome.storage.local.get(['logs'], (result) => {
        sendResponse(result.logs || []);
      });
      return true;
    }
    
    if (request.action === 'getDownloadedImages') {
      // Retrieve list of downloaded images
      chrome.storage.local.get([DownloadTracker.STORAGE_KEY], (result) => {
        sendResponse(result[DownloadTracker.STORAGE_KEY] || []);
      });
      return true; // Indicates async response
    }
    
    if (request.action === 'clearDownloadHistory') {
      // Clear download history
      DownloadTracker.clearDownloadHistory().then(() => {
        sendResponse({ success: true });
      });
      return true; // Indicates async response
    }
  } catch (error) {
    // Catch any unexpected errors
    Logger.error(`Messaging error: ${error.message}`);
    sendResponse({
      success: false,
      error: 'Unexpected error in message handling'
    });
    return true;
  }
});

// Track total downloads to prevent multiple notifications
let totalDownloadsInProgress = 0;
chrome.downloads.onCreated.addListener(() => {
  totalDownloadsInProgress++;
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
  if (downloadDelta.state && downloadDelta.state.current === 'complete') {
    totalDownloadsInProgress--;
  }
});

// Helper function to get filename from URL
function getFilenameFromUrl(url) {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  return filename;
}

// Utility function to get file extension
function getFileExtension(url) {
  // Extract file extension, default to .jpg
  const extensionMatch = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
  return extensionMatch ? extensionMatch[0] : '.jpg';
}
