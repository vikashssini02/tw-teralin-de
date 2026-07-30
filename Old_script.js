document.addEventListener('DOMContentLoaded', () => {

    /**
     * --- Advanced Affiliate Link Tracking with Memory ---
     * This function checks for a gclid in the URL. If found, it saves it
     * to the browser's memory (localStorage). On subsequent visits, if no gclid
     * is in the URL, it checks the memory to properly attribute the visit to the
     * original ad click.
     */
    const setupTrackingLinks = () => {
        // --- FIX 1: Made the path relative to work in both /fr/ and /de/ folders ---
        const redirectBaseUrl = './click'; // Changed from '/click'
        
        const urlParams = new URLSearchParams(window.location.search);
        const gclidFromUrl = urlParams.get('gclid');

        let s1Value;
        let finalGclid;

        // 1. Check for gclid in the URL from a new ad click
        if (gclidFromUrl && gclidFromUrl.trim() !== '') {
            localStorage.setItem('teralin_gclid', gclidFromUrl); // Save to memory
            s1Value = 'ads';
            finalGclid = gclidFromUrl;
            console.log('GCLID from URL stored:', finalGclid);
        
        } else {
            // 2. If no gclid in URL, check memory for a past ad click
            const gclidFromStorage = localStorage.getItem('teralin_gclid');
            if (gclidFromStorage) {
                s1Value = 'ads'; // Still attribute to ads because of memory
                finalGclid = gclidFromStorage;
                console.log('GCLID from localStorage retrieved:', finalGclid);
            } else {
                // 3. If no gclid in URL or memory, it's organic
                s1Value = 'organic';
                finalGclid = '';
            }
        }

        // 4. Build the final query string and update all CTA buttons
        const queryString = `?s1=${encodeURIComponent(s1Value)}&s2=${encodeURIComponent(finalGclid)}`;
        const finalButtonUrl = redirectBaseUrl + queryString;

        const ctaButtons = document.querySelectorAll('a.cta-button');
        ctaButtons.forEach(button => {
            // --- FIX 2: Removed the faulty 'if' condition to ensure ALL cta-buttons are updated ---
            button.href = finalButtonUrl;
        });

        console.log(`All CTA buttons updated to: ${finalButtonUrl}`);
    };

    /**
     * --- FAQ Accordion Logic ---
     * Handles the open/close functionality of the FAQ section.
     */
    const setupFaqAccordion = () => {
        document.querySelectorAll('.accordion-header').forEach(button => {
            button.addEventListener('click', () => {
                const accordionItem = button.parentElement;
                const accordionContent = button.nextElementSibling;
                const wasActive = accordionItem.classList.contains('active');

                // Close all other items first
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = null;
                });

                // If the clicked item wasn't already active, open it
                if (!wasActive) {
                    accordionItem.classList.add('active');
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }
            });
        });
    };

    /**
     * --- Sticky Header Logic ---
     * Adds a class to the header when the user scrolls down.
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
});