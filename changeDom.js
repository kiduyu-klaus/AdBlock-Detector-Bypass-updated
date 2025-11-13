(function() {
  'use strict';

  // Prevent multiple executions
  if (window.adblockBypassActive) return;
  window.adblockBypassActive = true;

  // Function to remove anti-adblock modals and restore page functionality
  function removeAntiAdblock() {
    // Remove all anti-adblock modals (including ones with generated IDs)
    const modalSelectors = [
      "[id^='anti-adblock-']",
      ".anti-adblock",
      "[class*='adblock']",
      "[id*='adblock']",
      "div[style*='z-index: 2147483647']",
      "div[style*='position: fixed'][style*='width: 100%'][style*='height: 100%']"
    ];
    
    modalSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && 
              (parseInt(style.zIndex) > 1000000 || 
               (style.width === '100%' && style.height === '100%') ||
               style.backdropFilter === 'blur(5px)')) {
            el.remove();
          }
        });
      } catch (e) {}
    });

    // Remove the bait element that detects adblockers
    const bait = document.getElementById('ad-detection-bait');
    if (bait) bait.remove();

    // Remove any divs with ad-related classes that are hidden
    try {
      document.querySelectorAll('.adxfire-banner-2, .adxfire-ad, [class*="ad-"], [id*="ad-"]').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.height === '1px' || style.width === '1px' || 
            parseInt(style.left) < -1000 || parseInt(style.top) < -1000) {
          el.remove();
        }
      });
    } catch (e) {}

    // Restore body scrolling
    try {
      if (document.body) {
        document.body.style.cssText = document.body.style.cssText.replace(/overflow\s*:\s*hidden/gi, 'overflow: auto');
      }
      if (document.documentElement) {
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.position = 'static';
      }
    } catch (e) {}
  }

  // Method 1: Immediate removal
  removeAntiAdblock();

  // Method 2: Monitor for new anti-adblock modals being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          try {
            // Check if it's an anti-adblock modal
            if (node.id && node.id.startsWith('anti-adblock-')) {
              node.remove();
              if (document.body) document.body.style.overflow = '';
              if (document.documentElement) document.documentElement.style.overflow = 'auto';
            }
            // Check for bait elements
            if (node.id === 'ad-detection-bait' || 
                (node.className && typeof node.className === 'string' && 
                 node.className.includes('ad-banner'))) {
              node.remove();
            }
            // Check for high z-index fixed position overlays
            if (node.style) {
              const zIndex = parseInt(node.style.zIndex);
              if (zIndex > 1000000 && node.style.position === 'fixed') {
                node.remove();
                if (document.body) document.body.style.overflow = '';
              }
            }
          } catch (e) {}
        }
      });
    });
  });

  // Start observing after a short delay
  setTimeout(() => {
    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (e) {}
  }, 100);

  // Method 3: Periodic cleanup every 2 seconds
  setInterval(removeAntiAdblock, 2000);

  // Method 4: Block setAttribute that sets overflow hidden
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name === 'style' && typeof value === 'string' && value.includes('overflow') && value.includes('hidden')) {
      // Strip out overflow: hidden
      value = value.replace(/overflow\s*:\s*hidden/gi, 'overflow: auto');
    }
    return originalSetAttribute.call(this, name, value);
  };

  // Method 5: Disable setInterval calls that restore modals (3000ms anti-adblock check)
  const originalSetInterval = window.setInterval;
  window.setInterval = function(callback, delay) {
    // Don't block our own intervals
    const callbackStr = callback.toString();
    if (callbackStr.includes('removeAntiAdblock')) {
      return originalSetInterval.call(window, callback, delay);
    }
    // Block known anti-adblock intervals
    if (delay === 3000 && (callbackStr.includes('checkAdBlock') || 
        callbackStr.includes('modal') || 
        callbackStr.includes('anti-adblock'))) {
      console.log('Blocked anti-adblock interval');
      return 999999; // Return dummy ID
    }
    return originalSetInterval.call(window, callback, delay);
  };

  // Method 6: Clean up on visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(removeAntiAdblock, 100);
    }
  });

  console.log('AdBlock Detector Bypass - Enhanced protection active');
})();