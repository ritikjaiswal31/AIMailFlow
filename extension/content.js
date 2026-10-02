// Log message to confirm that the content script has been successfully loaded
console.log("Email Writer Extension - Content Script Loaded");

/**
 * Creates the "AI Reply" button that will be injected into Gmail's compose toolbar
 */
function createAIButton() {

   // Create a new div element to act as a button
   const button = document.createElement('div');

   // Add Gmail button styling classes
   button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';

   // Add spacing between toolbar buttons
   button.style.marginRight = '8px';

   // Set button text
   button.innerHTML = 'AI Reply';

   // Accessibility role
   button.setAttribute('role', 'button');

   // Tooltip shown on hover
   button.setAttribute('data-tooltip', 'Generate AI Reply');

   return button;
}

/**
 * Extracts email content from the currently opened email thread
 */
function getEmailContent() {

    // Possible selectors where Gmail email content may exist
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    // Loop through selectors and return the first matching content
    for (const selector of selectors) {

        const content = document.querySelector(selector);

        if (content) {
            return content.innerText.trim();
        }
    }

    // Return empty string if no email content found
    return '';
}

/**
 * Finds the Gmail compose toolbar where the AI button should be inserted
 */
function findComposeToolbar() {

    // Different possible toolbar selectors in Gmail
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    // Search for the toolbar element
    for (const selector of selectors) {

        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }
    }

    // Return null if toolbar not found
    return null;
}

/**
 * Injects the AI Reply button into Gmail compose toolbar
 */
function injectButton() {

    // Remove existing AI button to prevent duplicates
    const existingButton = document.querySelector('.ai-reply-button');

    if (existingButton) {
        existingButton.remove();
    }

    // Find Gmail compose toolbar
    const toolbar = findComposeToolbar();

    // Exit if toolbar is not found
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");

    // Create button element
    const button = createAIButton();

    // Add custom class for identification
    button.classList.add('ai-reply-button');

    /**
     * Handle AI Reply button click
     */
    button.addEventListener('click', async () => {

        try {

            // Update button state while generating reply
            button.innerHTML = 'Generating...';
            button.disabled = true;

            // Get current email content
            const emailContent = getEmailContent();

            // Send request to backend API for AI-generated reply
            const response = await fetch('http://localhost:8080/api/email/generate', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                // Request payload
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            // Throw error if API request fails
            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            // Get generated reply text from API response
            const generatedReply = await response.text();

            // Find Gmail compose textbox
            const composeBox = document.querySelector(
                '[role="textbox"][g_editable="true"]'
            );

            // Insert generated reply into compose box
            if (composeBox) {

                composeBox.focus();

                // Insert text at cursor position
                document.execCommand('insertText', false, generatedReply);

            } else {

                console.error('Compose box was not found');
            }

        } catch (error) {

            // Log errors and notify user
            console.error(error);
            alert('Failed to generate reply');

        } finally {

            // Reset button state
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    // Insert button at the beginning of the toolbar
    toolbar.insertBefore(button, toolbar.firstChild);
}

/**
 * MutationObserver watches for Gmail compose window changes
 * and injects the AI button whenever a compose window appears
 */
const observer = new MutationObserver((mutations) => {

    // Loop through all DOM mutations
    for (const mutation of mutations) {

        // Convert added nodes into array
        const addedNodes = Array.from(mutation.addedNodes);

        // Check if compose-related elements were added
        const hasComposeElements = addedNodes.some(node =>

            node.nodeType === Node.ELEMENT_NODE &&

            (
                node.matches('.aDh, .btC, [role="dialog"]') ||

                node.querySelector('.aDh, .btC, [role="dialog"]')
            )
        );

        // If compose window detected, inject button
        if (hasComposeElements) {

            console.log("Compose Window Detected");

            // Delay slightly to allow Gmail UI to fully load
            setTimeout(injectButton, 500);
        }
    }
});

/**
 * Start observing the entire document body for DOM changes
 */
observer.observe(document.body, {

    childList: true, // Watch for direct child additions/removals

    subtree: true   // Watch entire subtree recursively
});