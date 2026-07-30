document.addEventListener('DOMContentLoaded', () => {

    /**
     * --- Advanced Affiliate Link Tracking with Memory ---
     */
    const setupTrackingLinks = () => {
        const redirectBaseUrl = './click'; 
        const urlParams = new URLSearchParams(window.location.search);
        const gclidFromUrl = urlParams.get('gclid');
        let s1Value;
        let finalGclid;

        if (gclidFromUrl && gclidFromUrl.trim() !== '') {
            localStorage.setItem('teralin_gclid', gclidFromUrl);
            s1Value = 'ads';
            finalGclid = gclidFromUrl;
        } else {
            const gclidFromStorage = localStorage.getItem('teralin_gclid');
            if (gclidFromStorage) {
                s1Value = 'ads';
                finalGclid = gclidFromStorage;
            } else {
                s1Value = 'organic';
                finalGclid = '';
            }
        }
        
        const queryString = `?s1=${encodeURIComponent(s1Value)}&s2=${encodeURIComponent(finalGclid)}`;
        const finalButtonUrl = redirectBaseUrl + queryString;
        const ctaButtons = document.querySelectorAll('a.cta-button');
        ctaButtons.forEach(button => {
            button.href = finalButtonUrl;
        });
        console.log(`All CTA buttons updated to: ${finalButtonUrl}`);
    };

    /**
     * --- GCLID Popup Logic with Memory ---
     * This now uses the SAME memory as the tracking links.
     */
    const setupGclidPopup = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const gclidFromUrl = urlParams.get('gclid');
        const gclidFromStorage = localStorage.getItem('teralin_gclid');
        let finalGclid = null;

        // Step 1: Check for GCLID in URL first, then in storage (memory)
        if (gclidFromUrl && gclidFromUrl.trim() !== '') {
            finalGclid = gclidFromUrl;
        } else if (gclidFromStorage) {
            finalGclid = gclidFromStorage;
        }

        // Step 2: Only proceed if a GCLID was found in either location
        if (finalGclid) {
            const popupOverlay = document.getElementById('gclid-popup-overlay');
            const confirmButton = document.getElementById('gclid-confirm-button');
            const declineButton = document.getElementById('gclid-decline-button');
            
            if (!popupOverlay || !confirmButton || !declineButton) return;

            // Show the popup
            popupOverlay.classList.remove('popup-hidden');
            popupOverlay.style.display = 'flex';

            // Define the redirect function
            const redirectToAffiliate = () => {
                const redirectUrl = `./click?s1=ads&s2=${encodeURIComponent(finalGclid)}`;
                window.location.href = redirectUrl;
            };

            // Attach event listeners to buttons
            confirmButton.addEventListener('click', redirectToAffiliate);
            declineButton.addEventListener('click', redirectToAffiliate);
        }
    };

    /**
     * --- FAQ Accordion Logic ---
     */
    const setupFaqAccordion = () => {
        document.querySelectorAll('.accordion-header').forEach(button => {
            button.addEventListener('click', () => {
                const accordionItem = button.parentElement;
                const accordionContent = button.nextElementSibling;
                const wasActive = accordionItem.classList.contains('active');
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = null;
                });
                if (!wasActive) {
                    accordionItem.classList.add('active');
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }
            });
        });
    };

    /**
     * --- Sticky Header Logic ---
     */
    const setupStickyHeader = () => {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.main-header');
            if (window.scrollY > 0) {
                header.classList.add('sticky-active');
            } else {
                header.classList.remove('sticky-active');
            }
        });
    };

    // --- Run all setup functions once the page is loaded ---
    setupTrackingLinks();
    setupFaqAccordion();
    setupStickyHeader();
    setupGclidPopup(); // The new popup function is now integrated
});