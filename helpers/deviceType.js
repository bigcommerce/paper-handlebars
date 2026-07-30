'use strict';

/**
 * Detects device type from user agent.
 * Returns 'android', 'iphone', 'ipad', 'blackberry', 'windows-phone', 'kindle', 'desktop', or 'other'
 * @example
 *  {{deviceType}}
 */
const factory = () => {
    return function() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Check for BlackBerry devices
        if (/BlackBerry|BB10|PlayBook/i.test(userAgent)) {
            return 'blackberry';
        }
        
        // Check for Windows Phone
        if (/Windows Phone|IEMobile|WPDesktop/i.test(userAgent)) {
            return 'windows-phone';
        }
        
        // Check for Kindle devices
        if (/Kindle|Silk/i.test(userAgent)) {
            return 'kindle';
        }
        
        // Check for Android devices
        if (/android/i.test(userAgent)) {
            return 'android';
        }
        
        // Check for iPad specifically
        if (/iPad/.test(userAgent) && !window.MSStream) {
            return 'ipad';
        }
        
        // Check for iPhone and iPod
        if (/iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'iphone';
        }
        
        // Check for iOS devices using newer detection method
        if (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1) {
            return 'ipad';
        }

        // Check for desktop devices (Windows, Mac, Linux)
        if (/Windows NT|Macintosh|Linux/i.test(userAgent) && !/Mobile|Tablet/i.test(userAgent)) {
            return 'desktop';
        }

        return 'other';
    };
};

module.exports = [{
    name: 'deviceType',
    factory: factory,
}];