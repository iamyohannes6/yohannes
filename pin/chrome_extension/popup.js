let allImages = new Set(); 
let downloadedImages = new Set();
let debugMode = false;
let downloadInProgress = false;

// Advanced Image Filtering Utility
const ImageFilter = {
  // Strict filtering criteria
  MIN_WIDTH: 500,
  MIN_HEIGHT: 500,

  // Comprehensive list of patterns indicating low-quality or profile images
  FILTER_PATTERNS: [
    // Profile picture indicators
    'avatar', 'profile_', '/user/', 'userpic', 
    'profile-pic', 'user-image', 'user_photo',
    
    // Size-related filters
    '/30x', '/50x', '/60x', '/75x', '/100x', 
    '/140x', '/150x', '/200x', '/250x',
    
    // Low-resolution or thumbnail indicators
    'small_', 'thumb_', 'thumbnail_', 'preview_', 
    'mini_', 'tiny_', 'micro_'
  ],

  // Validate an image URL
  isValidImage(url) {
    // Convert to lowercase for case-insensitive matching
    const lowercaseUrl = url.toLowerCase();

    // Comprehensive filtering checks
    const invalidChecks = [
      // Check against filter patterns
      () => this.FILTER_PATTERNS.some(pattern => 
        lowercaseUrl.includes(pattern)
      ),

      // Specific Pinterest profile URL patterns
      () => /\/pin\/\d+\/avatar/.test(lowercaseUrl),

      // Explicit size filtering
      () => {
        const sizeMatch = lowercaseUrl.match(/\/(\d+)x(\d+)\//);
        if (sizeMatch) {
          const width = parseInt(sizeMatch[1]);
          const height = parseInt(sizeMatch[2]);
          
          // Reject images smaller than minimum or known profile picture sizes
          return width < this.MIN_WIDTH || 
                 height < this.MIN_HEIGHT || 
                 (width === 140 && height === 140);
        }
        return false;
      },

      // Reject URLs with specific profile-related segments
      () => [
        '/avatars/', 
        '/profile/', 
        '/users/', 
        '/user_'
      ].some(segment => lowercaseUrl.includes(segment))
    ];

    // If ANY of the invalid checks return true, reject the image
    return !invalidChecks.some(check => check());
  },

  // Filter and prioritize images
  filterImages(images) {
    // First, filter out invalid images
    const validImages = images.filter(url => this.isValidImage(url));

    // Sort images by potential quality
    return validImages.sort((a, b) => {
      // Prioritize images with 'originals' or high-res indicators
      const highResIndicators = [
        '/originals/', '/full/', '/large/', '/max/'
      ];

      const aScore = highResIndicators.reduce((score, indicator) => 
        a.includes(indicator) ? score + 100 : score, 0);
      
      const bScore = highResIndicators.reduce((score, indicator) => 
        b.includes(indicator) ? score + 100 : score, 0);

      return bScore - aScore;
    });
  }
};

// Add settings management
const defaultSettings = {
  minWidth: 200,
  minHeight: 200,
  exactMatch: false,
  autoDownload: false,
  createSubfolders: false
};

let currentSettings = { ...defaultSettings };

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get('settings', (data) => {
    currentSettings = { ...defaultSettings, ...data.settings };
    updateSettingsUI();
  });
}

// Save settings to storage
function saveSettings() {
  const settings = {
    minWidth: parseInt(document.getElementById('minWidth').value) || defaultSettings.minWidth,
    minHeight: parseInt(document.getElementById('minHeight').value) || defaultSettings.minHeight,
    exactMatch: document.getElementById('exactMatch').checked,
    autoDownload: document.getElementById('autoDownload').checked,
    createSubfolders: document.getElementById('createSubfolders').checked
  };

  chrome.storage.sync.set({ settings }, () => {
    currentSettings = settings;
    updateStatus('Settings saved successfully!');
    closeSettingsModal();
  });
}

// Update UI with current settings
function updateSettingsUI() {
  document.getElementById('minWidth').value = currentSettings.minWidth;
  document.getElementById('minHeight').value = currentSettings.minHeight;
  document.getElementById('exactMatch').checked = currentSettings.exactMatch;
  document.getElementById('autoDownload').checked = currentSettings.autoDownload;
  document.getElementById('createSubfolders').checked = currentSettings.createSubfolders;
}

// Settings modal management
function openSettingsModal() {
  document.getElementById('settingsModal').style.display = 'block';
  updateSettingsUI();
}

function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}

// Modify image filtering based on settings
function filterImagesByResolution(images) {
  return images.filter(async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const meetsMinWidth = img.width >= currentSettings.minWidth;
        const meetsMinHeight = img.height >= currentSettings.minHeight;
        
        if (currentSettings.exactMatch) {
          resolve(img.width === currentSettings.minWidth && 
                 img.height === currentSettings.minHeight);
        } else {
          resolve(meetsMinWidth && meetsMinHeight);
        }
      };
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  });
}

// Initialize on popup load
document.addEventListener('DOMContentLoaded', async () => {
  // Restore previous state
  chrome.storage.local.get(['savedImages', 'selectedIndices'], (result) => {
    if (result.savedImages) {
      // Restore previous images
      allImages = new Set(result.savedImages);
      displayImages(Array.from(allImages));

      // Restore selected checkboxes if available
      if (result.selectedIndices) {
        result.selectedIndices.forEach(index => {
          const checkbox = document.querySelector(`.image-item input[data-index="${index}"]`);
          if (checkbox) checkbox.checked = true;
        });
      }
    }
  });

  // Fetch downloaded images
  chrome.runtime.sendMessage({ action: 'getDownloadedImages' }, (downloadedImagesList) => {
    downloadedImages = new Set(downloadedImagesList);
    updateImageDisplay();
  });

  // Event listeners
  document.getElementById('scanButton').addEventListener('click', scanImages);
  document.getElementById('downloadButton').addEventListener('click', downloadSelected);
  document.getElementById('selectAll').addEventListener('change', toggleSelectAll);

  // Add debug mode toggle
  const debugToggle = document.getElementById('debugToggle');
  if (debugToggle) {
    debugToggle.addEventListener('change', (e) => {
      debugMode = e.target.checked;
      document.getElementById('debugLogs').style.display = debugMode ? 'block' : 'none';
      
      if (debugMode) {
        // Fetch and display logs
        chrome.runtime.sendMessage({ action: 'getLogs' }, (logs) => {
          const logContainer = document.getElementById('debugLogsContent');
          logContainer.innerHTML = logs.map(log => `<div>${log}</div>`).join('');
        });
      }
    });
  }

  // Add reset button to the UI
  addResetButton();

  // Load settings
  loadSettings();
  
  // Settings button click handler
  document.getElementById('settingsButton').addEventListener('click', openSettingsModal);
  
  // Close button click handler
  document.querySelector('.close').addEventListener('click', closeSettingsModal);
  
  // Save settings button click handler
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('settingsModal')) {
      closeSettingsModal();
    }
  });

  // Add export button listener
  document.getElementById('exportButton').addEventListener('click', () => {
    if (allImages.size > 0) {
      exportImageLinks();
    } else {
      updateStatus('No images to export. Scan a board first!');
    }
  });
});

function saveImageState() {
  // Save images and selected indices
  const selectedIndices = Array.from(document.querySelectorAll('.image-item input[type="checkbox"]:checked'))
    .map(cb => cb.dataset.index);

  chrome.storage.local.set({
    savedImages: Array.from(allImages),
    selectedIndices: selectedIndices
  });
}

function toggleSelectAll(e) {
  const checked = e.target.checked;
  document.querySelectorAll('.image-item input[type="checkbox"]').forEach(cb => {
    cb.checked = checked;
  });
  saveImageState();
}

function updateImageDisplay() {
  // Fetch current downloaded images
  chrome.runtime.sendMessage({ action: 'getDownloadedImages' }, (downloadedImagesList) => {
    // Update downloadedImages set
    downloadedImages = new Set(downloadedImagesList);
    
    // Filter out downloaded and invalid images from allImages
    const remainingImages = Array.from(allImages).filter(img => 
      !downloadedImages.has(img) && ImageFilter.isValidImage(img)
    );
    
    // Update allImages with remaining images
    allImages = new Set(remainingImages);
    
    // Redisplay the filtered images
    displayImages(remainingImages);
    
    // Update download button state
    const selectedCheckboxes = document.querySelectorAll('.image-item input[type="checkbox"]:checked:not(:disabled)');
    document.getElementById('downloadButton').disabled = selectedCheckboxes.length === 0;
    
    // Update status
    const status = document.getElementById('status');
    status.textContent = `Remaining images: ${remainingImages.length}. Removed downloaded images.`;
  });
}

async function scanImages() {
  try {
    // Send message to content script to scan images
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scanImages' }, (response) => {
        if (chrome.runtime.lastError) {
          const errorMsg = chrome.runtime.lastError.message;
          document.getElementById('status').textContent = `Error: ${errorMsg}`;
          return;
        }

        if (!response || !response.images) {
          document.getElementById('status').textContent = 'No images found or error occurred.';
          return;
        }

        // Convert response images to a Set to remove duplicates
        const newImages = new Set(response.images);
        
        // Add new images to existing set
        newImages.forEach(img => allImages.add(img));

        // Display accumulated images
        displayImages(Array.from(allImages));

        // Enable download button if images found
        document.getElementById('downloadButton').disabled = allImages.size === 0;

        // Log debug information if debug mode is on
        if (debugMode) {
          const debugLogs = document.getElementById('debugLogsContent');
          debugLogs.innerHTML += `<p>Scanned ${newImages.size} new images. Total: ${allImages.size}</p>`;
        }

        // Apply resolution filtering based on settings
        const filteredImages = filterImagesByResolution(Array.from(allImages));
        if (currentSettings.autoDownload && filteredImages.length > 0) {
          downloadSelected();
        } else {
          displayImages(filteredImages);
        }
      });
    });
  } catch (error) {
    document.getElementById('status').textContent = `Error: ${error.message}`;
  }
}

function displayImages(images) {
  // Filter and sort images
  const filteredImages = ImageFilter.filterImages(images);
  
  const grid = document.getElementById('imageGrid');
  grid.innerHTML = '';
  
  // Update status with filtered image count
  const status = document.getElementById('status');
  status.textContent = `Found ${filteredImages.length} high-quality images. Total scanned: ${images.length}`;
  
  filteredImages.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'image-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.dataset.index = index;
    
    const image = document.createElement('img');
    image.src = img;
    image.title = `Image ${index + 1}`;
    
    // Add hover preview
    image.addEventListener('mouseover', () => {
      const preview = document.createElement('div');
      preview.className = 'image-preview';
      const previewImg = document.createElement('img');
      previewImg.src = img;
      preview.appendChild(previewImg);
      document.body.appendChild(preview);
    });
    
    image.addEventListener('mouseout', () => {
      const preview = document.querySelector('.image-preview');
      if (preview) preview.remove();
    });
    
    item.appendChild(checkbox);
    item.appendChild(image);
    grid.appendChild(item);
  });
  
  document.getElementById('imageSelection').style.display = 'block';
  document.getElementById('selectAll').checked = true;
  
  // Update image display with downloaded status
  updateImageDisplay();
  
  // Save the state
  saveImageState();
}

async function downloadSelected() {
  // Prevent multiple download attempts
  if (downloadInProgress) {
    alert('A download is already in progress!');
    return;
  }
  
  const status = document.getElementById('status');
  const progressBar = document.getElementById('progressBar');
  let folderPath = document.getElementById('folderPath').value.trim() || 'pinterest_downloads';
  
  // Clean up folder path
  folderPath = folderPath
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .replace(/\\/g, '/') // Convert backslashes to forward slashes
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
    .replace(/\/+/g, '/'); // Remove multiple consecutive slashes
  
  // Get selected images
  const selectedCheckboxes = document.querySelectorAll('.image-item input[type="checkbox"]:checked:not(:disabled)');
  const selectedImages = Array.from(selectedCheckboxes).map(cb => Array.from(allImages)[cb.dataset.index]);
  
  if (selectedImages.length === 0) {
    status.textContent = 'Please select at least one image to download.';
    return;
  }
  
  // Disable download button and reset progress
  document.getElementById('downloadButton').disabled = true;
  downloadInProgress = true;
  progressBar.style.width = '0%';
  
  // Send download request to background script
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'startDownload',
      images: selectedImages,
      folderPath: folderPath
    }, (response) => {
      // Check for runtime errors
      if (chrome.runtime.lastError) {
        const errorMsg = chrome.runtime.lastError.message || 'Unknown error occurred';
        status.textContent = `Error: ${errorMsg}`;
        downloadInProgress = false;
        document.getElementById('downloadButton').disabled = false;
        reject(new Error(errorMsg));
        return;
      }

      // Validate response
      if (!response) {
        status.textContent = 'No response from background script';
        downloadInProgress = false;
        document.getElementById('downloadButton').disabled = false;
        reject(new Error('No response'));
        return;
      }

      // Handle successful or failed response
      if (response.success) {
        status.textContent = 'Download started. Tracking progress...';
        
        // Update downloaded images
        chrome.runtime.sendMessage({ action: 'getDownloadedImages' }, (downloadedImagesList) => {
          downloadedImages = new Set(downloadedImagesList);
          updateImageDisplay();
        });
        
        // Start progress tracking
        startDownloadProgressTracking(response.progress);
        resolve(true);
      } else {
        status.textContent = `Error: ${response.error || 'Unknown error'}`;
        downloadInProgress = false;
        document.getElementById('downloadButton').disabled = false;
        reject(new Error(response.error));
      }
    });
    
    // Return true to indicate asynchronous response is expected
    return true;
  });
}

function startDownloadProgressTracking(initialProgress) {
  const progressBar = document.getElementById('progressBar');
  const status = document.getElementById('status');
  
  // Set initial progress
  if (initialProgress) {
    const percentage = initialProgress.total > 0 
      ? Math.round((initialProgress.completed / initialProgress.total) * 100) 
      : 0;
    progressBar.style.width = `${percentage}%`;
    status.textContent = `Downloading: ${initialProgress.completed}/${initialProgress.total} images`;
  }
  
  // Periodic progress check
  const progressInterval = setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getDownloadProgress' }, (progress) => {
      if (progress) {
        const percentage = progress.total > 0 
          ? Math.round((progress.completed / progress.total) * 100) 
          : 0;
        
        progressBar.style.width = `${percentage}%`;
        
        status.textContent = `Downloading: ${progress.completed}/${progress.total} images`;
        
        // Check if download is complete
        if (progress.completed === progress.total) {
          clearInterval(progressInterval);
          status.textContent = 'Download completed successfully!';
          downloadInProgress = false;
          document.getElementById('downloadButton').disabled = false;
          
          // Update downloaded images
          chrome.runtime.sendMessage({ action: 'getDownloadedImages' }, (downloadedImagesList) => {
            downloadedImages = new Set(downloadedImagesList);
            updateImageDisplay();
          });
        }
      }
    });
  }, 1000); // Check every second
}

// Add reset functionality
function resetExtension() {
  // Clear all stored data
  chrome.storage.local.clear(() => {
    // Reset global variables
    allImages = new Set();
    downloadedImages = new Set();

    // Clear image grid
    const grid = document.getElementById('imageGrid');
    grid.innerHTML = '';

    // Reset status and buttons
    const status = document.getElementById('status');
    status.textContent = 'Extension reset. Ready to scan new board.';

    const downloadButton = document.getElementById('downloadButton');
    downloadButton.disabled = true;

    const scanButton = document.getElementById('scanButton');
    scanButton.disabled = false;

    // Optional: Add a visual reset indicator
    grid.innerHTML = `
      <div class="reset-message">
        <p>Extension has been reset. Start a new scan!</p>
        <button id="newScanButton" class="btn btn-primary">New Scan</button>
      </div>
    `;

    // Log the reset for debugging
    console.log('Pinterest Downloader Extension Reset');
  });
}

// Add reset button to the UI
function addResetButton() {
  const controlPanel = document.getElementById('controlPanel');
  const resetButton = document.createElement('button');
  resetButton.id = 'resetButton';
  resetButton.className = 'btn btn-warning';
  resetButton.textContent = 'Reset Extension';
  resetButton.addEventListener('click', resetExtension);
  
  // Insert reset button after download button
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.parentNode.insertBefore(resetButton, downloadButton.nextSibling);
}

// Add this after the existing functions
function exportImageLinks() {
  // Get all images and filter them
  const images = Array.from(allImages);
  const filteredImages = ImageFilter.filterImages(images);
  
  // Create export data
  const exportData = {
    timestamp: new Date().toISOString(),
    totalImages: filteredImages.length,
    links: filteredImages
  };
  
  // Create a JSON blob
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  
  // Get current tab info for the filename
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let filename = 'pinterest_images.json';
    
    if (tabs[0]?.url) {
      try {
        const url = new URL(tabs[0].url);
        if (url.hostname.includes('pinterest')) {
          // Extract board name from URL
          const boardName = url.pathname.split('/').filter(Boolean).pop();
          if (boardName) {
            filename = `pinterest_${boardName}_${new Date().toISOString().split('T')[0]}.json`;
          }
        }
      } catch (e) {
        console.error('Error parsing URL:', e);
      }
    }
    
    // Create and trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    updateStatus(`Exported ${filteredImages.length} image links to ${filename}`);
  });
}
