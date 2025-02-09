const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const listingsContainer = document.getElementById('listings');

// RestDB Configuration
const RESTDB_API_KEY = '677f31d996bc7400895f1141';
const RESTDB_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings?';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const username = document.getElementById("username");
const date = document.getElementById("joinedOn");
const email = document.getElementById("email");
const profilePicture = document.querySelector(".profile-picture");

// Set user information
if (user) {
    username.textContent = user.name;
    date.textContent = new Date(user.createdAt).toLocaleDateString();
    email.textContent = user.email;
    if (user.profilePicture) {
        profilePicture.src = user.profilePicture;
    }
}

// Tab functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Fetch user's listings from RestDB
async function fetchUserListings() {
    try {
        // Add loading state
        listingsContainer.innerHTML = '<p>Loading your listings...</p>';

        // Query only listings for the current user
        const queryParams = new URLSearchParams({
            q: JSON.stringify({ sellerID: user.id })
        });

        const response = await fetch(`${RESTDB_URL}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_API_KEY,
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const listings = await response.json();
        
        // Clear existing content
        listingsContainer.innerHTML = '';
        
        // Display user's listings
        if (listings.length === 0) {
            listingsContainer.innerHTML = '<p>No listings found.</p>';
        } else {
            listings.forEach(listing => {
                listingsContainer.innerHTML += createProductCard(listing);
            });
            
            // Add event listeners for the like buttons and more options
            setupListingInteractions();
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        listingsContainer.innerHTML = '<p>Error loading listings. Please try again later.</p>';
    }
}

function setupListingInteractions() {
    // Setup like button functionality
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLikeClick);
    });

    // Setup more options functionality
    const moreButtons = document.querySelectorAll('.more');
    moreButtons.forEach(button => {
        button.addEventListener('click', toggleMoreOptions);
    });
}

function handleLikeClick(event) {
    const heartStroke = event.currentTarget.querySelector('.heart-stroke');
    const heartFilled = event.currentTarget.querySelector('.heart-filled');
    const likeCount = event.currentTarget.parentElement.querySelector('.like-count');
    
    if (heartFilled.style.display === 'none') {
        heartStroke.style.display = 'none';
        heartFilled.style.display = 'block';
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        heartFilled.style.display = 'none';
        heartStroke.style.display = 'block';
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    }
}

function toggleMoreOptions(event) {
    const reportMenu = event.currentTarget.querySelector('.more-report');
    reportMenu.style.display = reportMenu.style.display === 'none' ? 'block' : 'none';
}

// Call fetchUserListings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (user) {
        fetchUserListings();
    } else {
        listingsContainer.innerHTML = '<p>Please log in to view your listings.</p>';
    }
});

// Keep the existing createProductCard function
function createProductCard(product) {
    const sanitizedProduct = {
        listingID: sanitizeHTML(product.listingID),
        title: sanitizeHTML(product.title),
        description: truncateText(sanitizeHTML(product.description), 15),
        condition: sanitizeHTML(product.condition),
        category: sanitizeHTML(product.category),
        price: Number(product.price).toFixed(2),
        likes: parseInt(product.likes) || 0,
        dealLocation: sanitizeHTML(product.dealLocation),
        sellerID: sanitizeHTML(product.sellerID),
        sellerName: sanitizeHTML(product.sellerName),
        coverImage: sanitizeHTML(product.coverImage),
        images: sanitizeHTML(product.images),
        _id: sanitizeHTML(product._id) // Add this for PATCH requests
    };

    return `
        <div class="product-card product" 
            data-listing-id="${sanitizedProduct.listingID}"
            data-id="${sanitizedProduct._id}"
            data-title="${sanitizedProduct.title}"
            data-description="${product.description}"
            data-condition="${sanitizedProduct.condition}"
            data-category="${sanitizedProduct.category}"
            data-price="${sanitizedProduct.price}"
            data-likes="${sanitizedProduct.likes}"
            data-deal-location="${sanitizedProduct.dealLocation}"
            data-seller-id="${sanitizedProduct.sellerID}"
            data-seller-name="${sanitizedProduct.sellerName}"
            data-images="${sanitizedProduct.images}"
            data-cover-image="${sanitizedProduct.coverImage}">
            <div class="product-image" style="background-image: url('${sanitizedProduct.coverImage}')"></div>
            <div class="product-info">
                <div class="product-header">
                    <h3>${sanitizedProduct.title}</h3>
                    <div class="action-buttons">
                        <button class="modify-button" onclick="openModifyModal('${sanitizedProduct._id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                        </button>
                        <button class="delete-button" onclick="handleDelete('${sanitizedProduct._id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- Rest of the product card content remains the same -->
            </div>
        </div>
    `;
}

// Helper function for text truncation
function truncateText(text, words) {
    const wordArray = text.split(' ');
    if (wordArray.length > words) {
        return wordArray.slice(0, words).join(' ') + '...';
    }
    return text;
}

// Helper function for HTML sanitization
function sanitizeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}