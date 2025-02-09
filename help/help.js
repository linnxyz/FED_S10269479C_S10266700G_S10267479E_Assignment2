document.addEventListener('DOMContentLoaded', () => {
    const defaultView = document.getElementById('defaultView');
    const expandedView = document.getElementById('expandedView');
    const expandedTitle = document.getElementById('expandedTitle');
    const subsectionsList = document.getElementById('subsectionsList');
    const backButton = document.querySelector('.back-button');

    // Navigation data with descriptive content instead of clickable options
    const sections = {
        scams: {
            title: 'Guard against scams and phishing',
            subsections: [
                'Emails, Texts, and Calls: Be cautious of unsolicited messages claiming to be from banks, government agencies, or companies. Scammers often impersonate trusted organizations. Verify the Source: If you receive a suspicious message, contact the organization directly using their official website or phone number (not the one provided in the message).',
                'Check for red flags: Poor grammar or spelling mistakes. Urgent or threatening language (e.g., "Your account will be closed!"). Requests for personal information like passwords, Social Security numbers, or credit card details.',
                "Protect your information: Never share sensitive details through unsolicited messages. Use strong, unique passwords for all accounts. Enable two-factor authentication when available."
            ]
        },
        chats: {
            title: 'Chats, ratings and reviews',
            subsections: [
                'Communication Guidelines: Use clear, professional language in all communications. Avoid excessive slang, abbreviations, or all caps. Keep messages concise but informative.',
                'Response Etiquette: Aim to respond to messages within 24 hours. If you need more time, send a quick acknowledgment message. Be patient and professional even in difficult conversations.',
                'Review System: Ratings and reviews help build trust in our community. Be honest and constructive in your feedback. Focus on factual experiences rather than emotional reactions.'
            ]
        },
        account: {
            title: 'My account',
            subsections: [
                'Account Security: We recommend enabling two-factor authentication for additional protection. Regularly update your password and never share it with others. Monitor your account activity for any suspicious changes.',
                'Profile Management: Keep your contact information current. Add a clear profile picture and complete your bio to build trust. Maintain accurate shipping and payment information.',
                'Privacy Settings: Review and adjust your privacy settings regularly. Control what information is visible to other users. Understand how your data is used and protected.'
            ]
        },
        selling: {
            title: 'Selling',
            subsections: [
                'Listing Requirements: Products must have clear photos, accurate descriptions, and fair pricing. Include important details like size, condition, and shipping options. Keep your inventory updated.',
                'Shop Management: Organize your items into categories for easy browsing. Maintain consistent branding across your listings. Regularly update your shop policies and announcements.',
                'Seller Guidelines: Follow all marketplace rules and regulations. Provide accurate shipping times and tracking information. Maintain professional communication with buyers.'
            ]
        },
        buying: {
            title: 'Buying',
            subsections: [
                'Shopping Process: Browse listings, review seller ratings, and check item descriptions carefully. Contact sellers with questions before purchasing. Use secure payment methods only.',
                'Buyer Protection: Understand your rights and protections as a buyer. Document any issues with photos immediately upon receipt. Follow proper procedures for disputes.',
                'Returns Process: Review seller return policies before purchasing. Keep original packaging for potential returns. Contact seller within the specified timeframe for issues.'
            ]
        },
        payments: {
            title: 'Payments, shipping & support',
            subsections: [
                'Accepted Payment Methods: We support major credit cards, digital wallets, and bank transfers. All transactions are encrypted and secure. Keep payment information up to date.',
                'Shipping Information: Package items securely with appropriate protection. Use tracking for all shipments. Consider insurance for valuable items.',
                'Customer Support Resources: Access help articles, FAQs, and contact forms. Support team available via email and chat. Response times typically within 24-48 hours.'
            ]
        },
        rules: {
            title: 'Marketplace rules',
            subsections: [
                'Community Standards: Treat all users with respect and courtesy. No harassment, discrimination, or harmful behavior. Maintain professional communication at all times.',
                'Restricted Items: Review the complete list of prohibited items. Understand category-specific restrictions. Report violations to maintain community safety.',
                'Platform Policies: Familiarize yourself with terms of service. Follow pricing and fee guidelines. Understand consequences of policy violations.'
            ]
        },
        troubleshooting: {
            title: 'Troubleshooting',
            subsections: [
                'Common Solutions: Clear browser cache and cookies. Check internet connection. Verify account login credentials. Update app to latest version.',
                'Technical Issues: Platform compatibility requirements. Browser and device recommendations. Known issues and workarounds.',
                'App Support: Installation and update guidance. Feature tutorials and walkthroughs. Performance optimization tips.'
            ]
        }
    };

    // Add click handlers to topic cards
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
        card.addEventListener('click', () => {
            const sectionId = card.dataset.section;
            expandSection(sectionId);
        });
    });

    // Back button handler
    backButton.addEventListener('click', () => {
        defaultView.classList.remove('hidden');
        expandedView.classList.add('hidden');
    });

    // Function to expand a section
    function expandSection(sectionId) {
        const section = sections[sectionId];
        if (!section) return;
        
        // Update expanded view content
        expandedTitle.textContent = section.title;
        subsectionsList.innerHTML = section.subsections
            .map(subsection => `
                <div class="subsection-item">
                    <p class="info-text">${subsection}</p>
                </div>
            `)
            .join('');

        // Show expanded view, hide default view
        defaultView.classList.add('hidden');
        expandedView.classList.remove('hidden');
    }
});