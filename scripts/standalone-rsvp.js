/**
 * Standalone RSVP Form Handler
 * This script is designed to work independently of any existing code
 * It handles showing/hiding conditional sections based on attendance selection
 */

(function() {
    console.log('Standalone RSVP script initializing...');
    
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeRsvpForm();
    });
    
    // Also try to initialize immediately if the script runs after DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeRsvpForm();
    }
    
    function initializeRsvpForm() {
        console.log('Initializing standalone RSVP form handler');
        
        // Try multiple selector approaches to find the attendance radio buttons
        const yesRadioSelectors = [
            'input[name="attendance"][value="yes"]',
            '#yesRadio',
            'input[value="yes"]',
            '.attendance-yes',
            'input[type="radio"][value="yes"]'
        ];
        
        const noRadioSelectors = [
            'input[name="attendance"][value="no"]',
            '#noRadio',
            'input[value="no"]',
            '.attendance-no',
            'input[type="radio"][value="no"]'
        ];
        
        // Conditional section selectors
        const conditionalSectionSelectors = [
            '#conditional-sections',
            '.conditional-section',
            '#attendance-details',
            '#attendanceDetails',
            '.attendance-details'
        ];
        
        // Find the elements
        let yesRadio = null;
        for (const selector of yesRadioSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                yesRadio = element;
                console.log('Found "Yes" radio with selector:', selector);
                break;
            }
        }
        
        let noRadio = null;
        for (const selector of noRadioSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                noRadio = element;
                console.log('Found "No" radio with selector:', selector);
                break;
            }
        }
        
        let conditionalSections = [];
        for (const selector of conditionalSectionSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                console.log(`Found ${elements.length} conditional sections with selector: ${selector}`);
                conditionalSections = [...conditionalSections, ...elements];
            }
        }
        
        // If we can't find the conditional sections by ID/class, try to find by context
        if (conditionalSections.length === 0) {
            console.log('Trying to find conditional sections by content...');
            
            // Look for elements that might be conditional sections based on their content
            const possibleSections = [
                document.querySelectorAll('div:has(#guestCount)'),
                document.querySelectorAll('div:has(label[for="guestCount"])'),
                document.querySelectorAll('div:has(#dietaryRestrictions)'),
                document.querySelectorAll('div:has(label[for="dietaryRestrictions"])'),
                document.querySelectorAll('div:has(#special-message)'),
                document.querySelectorAll('div:has(.special-message)'),
                document.querySelectorAll('div:has(#specialMessage)'),
                document.querySelectorAll('div:has(label[for="specialMessage"])')
            ];
            
            possibleSections.forEach(sections => {
                if (sections && sections.length > 0) {
                    conditionalSections = [...conditionalSections, ...sections];
                }
            });
            
            // Find all selects and textareas that might be in conditional sections
            document.querySelectorAll('select, textarea').forEach(element => {
                // Find the closest container
                let container = element.closest('.form-section') || 
                                element.closest('.form-group') || 
                                element.closest('div');
                                
                if (container && !conditionalSections.includes(container)) {
                    conditionalSections.push(container);
                }
            });
        }
        
        console.log(`Total conditional sections found: ${conditionalSections.length}`);
        
        // Handle radio button changes
        function handleRadioChange() {
            console.log('Radio change detected');
            
            // Check if yes radio is checked
            const isYesChecked = yesRadio && yesRadio.checked;
            
            console.log('Is "Yes" checked?', isYesChecked);
            
            // Update visibility of conditional sections
            conditionalSections.forEach(section => {
                if (isYesChecked) {
                    console.log('Showing section:', section);
                    section.style.display = 'block';
                    section.style.opacity = '1';
                    section.style.maxHeight = '1000px';
                    section.style.overflow = 'visible';
                    section.style.visibility = 'visible';
                } else {
                    console.log('Hiding section:', section);
                    section.style.display = 'none';
                    section.style.opacity = '0';
                    section.style.maxHeight = '0';
                    section.style.overflow = 'hidden';
                    section.style.visibility = 'hidden';
                }
            });
            
            // Make fields required or not based on attendance
            document.querySelectorAll('#guestCount, [name="guestCount"]').forEach(field => {
                field.required = isYesChecked;
            });
        }
        
        // Attach event listeners if elements were found
        if (yesRadio) {
            yesRadio.addEventListener('change', handleRadioChange);
            console.log('Added change event listener to "Yes" radio');
        } else {
            console.warn('Could not find "Yes" radio button');
        }
        
        if (noRadio) {
            noRadio.addEventListener('change', handleRadioChange);
            console.log('Added change event listener to "No" radio');
        } else {
            console.warn('Could not find "No" radio button');
        }
        
        // Check if a radio button is already selected when the page loads
        if (yesRadio && yesRadio.checked) {
            console.log('"Yes" radio is already checked, showing conditional sections');
            handleRadioChange();
        }
        
        // Also attach listeners to all radio buttons as a fallback
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                console.log('Generic radio changed:', radio.name, radio.value);
                
                // If this is an attendance radio, handle the conditional sections
                if (radio.name === 'attendance' || radio.name.includes('attend')) {
                    const isYes = radio.value === 'yes' || 
                                radio.value.includes('yes') || 
                                radio.value.includes('attending');
                                
                    console.log('Is this a "Yes" value?', isYes);
                    
                    conditionalSections.forEach(section => {
                        section.style.display = isYes ? 'block' : 'none';
                    });
                }
            });
        });
        
        console.log('Standalone RSVP form handler initialized successfully');
    }
})();
