(function() {
  'use strict';

  // Function to remove anti-adblock modals and restore page functionality
  function removeAntiAdblock() {
    // Remove all anti-adblock modals (including ones with generated IDs)
    const modalSelectors = [
      "[id^='anti-adblock-']",
      ".anti-adblock",
      "[class*='adblock']",
      "[id*='adblock']"
    ];
    
    modalSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.style.zIndex > 1000000 || 
            el.style.position === 'fixed' && 
            (el.style.width === '100%' || el.style.height === '100%')) {
          el.remove();
        }
      });
    });

    // Remove the bait element that detects adblockers
    const bait = document.getElementById('ad-detection-bait');
    if (bait) bait.remove();

    // Restore body scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.position = 'static';
  }

  // Method 1: Quick removal of existing modals
  removeAntiAdblock();

  // Method 2: Reload the page with a fresh DOM (original method)
  var xhr = new XMLHttpRequest();
  
  xhr.onload = function() {
    document.documentElement.innerHTML = this.responseXML.documentElement.outerHTML;
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.position = "static";
    
    // After DOM reload, set up continuous monitoring
    setupContinuousProtection();
  };
  
  xhr.open('GET', window.location.href);
  xhr.responseType = 'document';
  xhr.send();

  // Method 3: Continuous monitoring to prevent modal restoration
  function setupContinuousProtection() {
    // Monitor for new anti-adblock modals being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if it's an anti-adblock modal
            if (node.id && node.id.startsWith('anti-adblock-')) {
              node.remove();
              document.body.style.overflow = '';
              document.documentElement.style.overflow = 'auto';
            }
            // Check for bait elements
            if (node.id === 'ad-detection-bait') {
              node.remove();
            }
          }
        });
      });
    });

    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Periodic cleanup every 2 seconds
    setInterval(removeAntiAdblock, 2000);

    // Prevent scripts from detecting our modifications
    Object.defineProperty(document.body.style, 'overflow', {
      get: function() { return 'auto'; },
      set: function(value) { 
        if (value !== 'hidden') {
          Object.defineProperty(this, 'overflow', {
            value: value,
            writable: true,
            configurable: true
          });
        }
      },
      configurable: true
    });
  }

  // Initial setup
  setupContinuousProtection();

  // Clean up on visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(removeAntiAdblock, 100);
    }
  });

  console.log('Enhanced AdBlock Detector Bypass active');
})();