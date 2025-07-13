// Advanced Formspree Diagnostic Tool
// This will help identify why you get 200 responses but empty content

async function runFormspreDiagnostic() {
    console.log('🔍 ADVANCED FORMSPREE DIAGNOSTIC STARTING...');
    console.log('='.repeat(50));
    
    const endpoints = [
        { name: 'RSVP', id: 'mgvzwven' },
        { name: 'Contact', id: 'xjkobkkb' },
        { name: 'Gallery', id: 'mnnzanqe' }
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\n📋 Testing ${endpoint.name} Form (${endpoint.id})`);
        console.log('-'.repeat(40));
        
        await testFormspreeEndpoint(endpoint.name, endpoint.id);
    }
    
    console.log('\n🔍 DIAGNOSTIC COMPLETE');
    console.log('='.repeat(50));
}

async function testFormspreeEndpoint(name, endpointId) {
    const url = `https://formspree.io/f/${endpointId}`;
    
    try {
        // Test 1: Basic GET request to see if endpoint exists
        console.log(`1️⃣ Testing endpoint existence: ${url}`);
        
        const getResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        
        console.log(`   GET Status: ${getResponse.status} ${getResponse.statusText}`);
        console.log(`   GET Headers:`, Object.fromEntries(getResponse.headers.entries()));
        
        const getBody = await getResponse.text();
        console.log(`   GET Body length: ${getBody.length} chars`);
        console.log(`   GET Body preview: "${getBody.substring(0, 200)}..."`);
        
        // Test 2: OPTIONS request to check CORS
        console.log(`\n2️⃣ Testing CORS (OPTIONS)`);
        
        try {
            const optionsResponse = await fetch(url, {
                method: 'OPTIONS',
                headers: {
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type,Accept'
                }
            });
            
            console.log(`   OPTIONS Status: ${optionsResponse.status}`);
            console.log(`   CORS Headers:`, Object.fromEntries(optionsResponse.headers.entries()));
        } catch (corsError) {
            console.log(`   CORS Error: ${corsError.message}`);
        }
        
        // Test 3: POST with minimal data
        console.log(`\n3️⃣ Testing POST with minimal data`);
        
        const minimalForm = new FormData();
        minimalForm.append('test', 'true');
        minimalForm.append('name', 'Test User');
        minimalForm.append('email', 'test@example.com');
        
        const postResponse = await fetch(url, {
            method: 'POST',
            body: minimalForm
        });
        
        console.log(`   POST Status: ${postResponse.status} ${postResponse.statusText}`);
        console.log(`   POST Headers:`, Object.fromEntries(postResponse.headers.entries()));
        
        const postBody = await postResponse.text();
        console.log(`   POST Body length: ${postBody.length} chars`);
        console.log(`   POST Body: "${postBody}"`);
        
        // Test 4: POST with JSON Accept header
        console.log(`\n4️⃣ Testing POST with JSON Accept header`);
        
        const jsonForm = new FormData();
        jsonForm.append('test', 'json-test');
        jsonForm.append('name', 'JSON Test User');
        jsonForm.append('email', 'jsontest@example.com');
        
        const jsonResponse = await fetch(url, {
            method: 'POST',
            body: jsonForm,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log(`   JSON POST Status: ${jsonResponse.status} ${jsonResponse.statusText}`);
        console.log(`   JSON POST Headers:`, Object.fromEntries(jsonResponse.headers.entries()));
        
        const jsonBody = await jsonResponse.text();
        console.log(`   JSON POST Body length: ${jsonBody.length} chars`);
        console.log(`   JSON POST Body: "${jsonBody}"`);
        
        // Try to parse as JSON
        try {
            const jsonParsed = JSON.parse(jsonBody);
            console.log(`   JSON Parsed:`, jsonParsed);
        } catch (e) {
            console.log(`   JSON Parse Error: ${e.message}`);
            console.log(`   Response is not valid JSON`);
        }
        
        // Test 5: Check Content-Type handling
        console.log(`\n5️⃣ Testing different Content-Type`);
        
        const formUrlEncoded = new URLSearchParams();
        formUrlEncoded.append('test', 'urlencoded-test');
        formUrlEncoded.append('name', 'URL Encoded Test');
        formUrlEncoded.append('email', 'urltest@example.com');
        
        const urlencodedResponse = await fetch(url, {
            method: 'POST',
            body: formUrlEncoded,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });
        
        console.log(`   URLEncoded Status: ${urlencodedResponse.status}`);
        const urlencodedBody = await urlencodedResponse.text();
        console.log(`   URLEncoded Body: "${urlencodedBody}"`);
        
    } catch (error) {
        console.log(`❌ Error testing ${name} endpoint:`, error);
    }
}

// Function to test current form behavior
async function testCurrentFormBehavior() {
    console.log('\n🎯 TESTING CURRENT FORM BEHAVIOR');
    console.log('='.repeat(50));
    
    // Simulate exactly what the current forms are doing
    const formData = new FormData();
    formData.append('name', 'Current Form Test');
    formData.append('email', 'currenttest@example.com');
    formData.append('message', 'Testing current form implementation');
    formData.append('_timestamp', new Date().toISOString());
    
    console.log('Form data being sent:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }
    
    const response = await fetch('https://formspree.io/f/mgvzwven', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    // Read response as text first
    const responseText = await response.text();
    console.log(`Response Text Length: ${responseText.length}`);
    console.log(`Response Text: "${responseText}"`);
    
    // Check if response is empty
    if (responseText.length === 0) {
        console.log('🚨 ISSUE FOUND: Response body is completely empty!');
        console.log('This suggests the request is being processed but no content is returned.');
        console.log('This could indicate:');
        console.log('- Formspree is configured for redirect instead of JSON response');
        console.log('- The form endpoint is set to return empty responses');
        console.log('- There\'s a configuration issue on Formspree side');
    } else {
        console.log('✅ Response has content, checking if it\'s valid JSON...');
        try {
            const jsonData = JSON.parse(responseText);
            console.log('✅ Valid JSON response:', jsonData);
        } catch (e) {
            console.log('❌ Response is not valid JSON');
            console.log('Raw response:', responseText);
        }
    }
}

// Auto-run diagnostic
setTimeout(() => {
    runFormspreDiagnostic().then(() => {
        return testCurrentFormBehavior();
    });
}, 1000);
