// Network Request Debugger for Formspree Forms
// Add this to any form page to debug network requests

(function() {
    'use strict';
    
    // Intercept all fetch requests
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const [url, options] = args;
        
        // Only log Formspree requests
        if (url && url.includes('formspree.io')) {
            console.log('🌐 FORMSPREE REQUEST INTERCEPTED');
            console.log('URL:', url);
            console.log('Options:', options);
            
            if (options && options.body instanceof FormData) {
                console.log('FormData contents:');
                for (let [key, value] of options.body.entries()) {
                    console.log(`  ${key}: ${value}`);
                }
            }
            
            // Check if we're on the right domain
            console.log('Current domain:', window.location.origin);
            console.log('Request headers:', options?.headers);
        }
        
        // Make the actual request
        const promise = originalFetch.apply(this, args);
        
        // Log response for Formspree requests
        if (url && url.includes('formspree.io')) {
            promise.then(async (response) => {
                console.log('🌐 FORMSPREE RESPONSE RECEIVED');
                console.log('Status:', response.status);
                console.log('Status Text:', response.statusText);
                console.log('Headers:', Object.fromEntries(response.headers.entries()));
                
                // Clone response to read body without consuming it
                const responseClone = response.clone();
                try {
                    const text = await responseClone.text();
                    console.log('Response body:', text);
                    
                    if (text) {
                        try {
                            const json = JSON.parse(text);
                            console.log('Parsed JSON:', json);
                        } catch (e) {
                            console.log('Response is not valid JSON');
                        }
                    }
                } catch (e) {
                    console.log('Could not read response body:', e);
                }
            }).catch(error => {
                console.log('🚨 FORMSPREE REQUEST FAILED');
                console.log('Error:', error);
            });
        }
        
        return promise;
    };
    
    // Also log any XMLHttpRequest usage (just in case)
    const originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXMLHttpRequest();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        
        xhr.open = function(method, url, ...args) {
            if (url && url.includes('formspree.io')) {
                console.log('📡 XHR TO FORMSPREE:', method, url);
            }
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        xhr.send = function(data) {
            if (this._url && this._url.includes('formspree.io')) {
                console.log('📡 XHR SENDING DATA:', data);
            }
            return originalSend.apply(this, [data]);
        };
        
        return xhr;
    };
    
    console.log('🔍 Network debugger loaded - will intercept Formspree requests');
    
    // Test connectivity to Formspree
    function testFormspreeConnectivity() {
        console.log('🧪 Testing Formspree connectivity...');
        
        fetch('https://formspree.io', {
            method: 'HEAD',
            mode: 'no-cors'
        }).then(() => {
            console.log('✅ Can reach formspree.io');
        }).catch(error => {
            console.log('❌ Cannot reach formspree.io:', error);
        });
    }
    
    // Auto-test connectivity
    setTimeout(testFormspreeConnectivity, 1000);
    
})();
