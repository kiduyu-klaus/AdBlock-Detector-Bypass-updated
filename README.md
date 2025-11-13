## AdBlock-Detector-Bypass

A chrome extension that removes obtrusive popups that prevent you from viewing webpage content when an adblocker is detected.

When an AdBlock Detector popup appears simply click the extension icon to remove the popup and continue reading the article.

Install the extension [here](https://chrome.google.com/webstore/detail/adblock-detector-bypass/acjlefdefjkldgcimnfkehgbnpjekedo)

### Version 3.0 - Enhanced Protection

**What's New:**
- **Advanced Anti-Adblock Bypass**: Now defeats sophisticated detection scripts that continuously monitor and restore popups
- **Real-time Protection**: MutationObserver actively watches for new popups and removes them instantly
- **Scroll Lock Prevention**: Forcefully prevents scripts from disabling page scrolling
- **Bait Element Removal**: Automatically detects and removes "bait" elements used to detect adblockers
- **Continuous Monitoring**: Runs periodic checks every 2 seconds to ensure popups stay removed
- **Tab Visibility Handling**: Re-checks protection when you return to the tab

**How It Works:**
1. **Immediate Removal**: Instantly removes any existing anti-adblock modals when activated
2. **DOM Reload**: Fetches a fresh copy of the page to bypass client-side modifications
3. **Continuous Protection**: Uses MutationObserver and periodic checks to prevent popup restoration

### Verified to work on:
- Forbes
- USA Today
- Business Insider
- CNBC
- Toronto Sun
- NY Times
- EuroGamer
- USGamer
- GamesRadar
- Bloomberg
- Toronto Star
- **Sites using advanced TamperMonkey anti-adblock scripts**
- **Sites with continuous modal restoration**
- **Sites with bait-based detection**

### Technical Details

The extension uses three complementary methods:

**Method 1: Quick Removal**
- Removes existing anti-adblock modals by detecting common patterns
- Removes bait elements used for detection
- Restores page scrolling immediately

**Method 2: DOM Reload**
- Fetches a clean copy of the page via XMLHttpRequest
- Replaces the modified DOM with the fresh response
- Bypasses client-side scripts that have already run

**Method 3: Continuous Monitoring**
- MutationObserver watches for new modals being added
- Periodic cleanup every 2 seconds catches persistent scripts
- Protects against scroll-locking by intercepting overflow modifications
- Handles visibility changes when switching tabs

### Privacy & Security

This extension:
- Only runs when you click the extension icon (no automatic background activity)
- Requires only `scripting` and `activeTab` permissions
- Does not collect, transmit, or store any user data
- Works entirely client-side in your browser

### Limitations

May not work for:
- Server-side adblock detection (where blocking happens before the page loads)
- Sites with aggressive fingerprinting or machine learning-based detection
- Paywalls or subscription requirements (this extension only removes popup overlays)

### Contributing

Found a site where it doesn't work? Submit an issue with the URL and we'll investigate adding support.