const RESTDB_API_KEY = '677f31d996bc7400895f1141';
const RESTDB_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings?';
let page = 1;
let loading = false;
let hasMore = true;

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createProductCard(product) {
    const sanitizedProduct = {
        listingID: sanitizeHTML(product.listingID),
        title: sanitizeHTML(product.title),
        description: sanitizeHTML(product.description),
        condition: sanitizeHTML(product.condition),
        category: sanitizeHTML(product.category),
        price: Number(product.price).toFixed(2),
        likes: parseInt(product.likes) || 0
    };

    return `
        <div class="product-card">
            <div id="listingID" style="display: none">${sanitizedProduct.listingID}</div>
            <div class="product-image"></div>
            <div class="product-info">
                <div class="product-header">
                    <h3>${sanitizedProduct.title}</h3>
                    <div class="like-container">
                        <div class="like-button">
                            <svg class="heart-stroke" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                            </svg>
                            <svg class="heart-filled" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                            </svg>
                        </div>
                        <span class="like-count">${sanitizedProduct.likes}</span>
                    </div>
                </div>
                <p class="product-description">${sanitizedProduct.description}</p>
                <div class="tags">
                    <span class="condition-tag">${sanitizedProduct.condition}</span>
                    <span class="category-tag">${sanitizedProduct.category}</span>
                </div>
                <div class="product-footer">
                    <div class="price">$${sanitizedProduct.price}</div>
                    <div class="more">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        </svg>
                        <!-- Dropdown Menu -->
                        <div class="more-report" style="display: none;">
                            <button class="report-post">
                                <svg class="flag" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-flag" viewBox="0 0 16 16">
                                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z"/>
                                </svg>
                                Report Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Rest of the JavaScript remains the same as in the previous version
// [Previous JavaScript code for fetching and displaying products]

async function fetchTrendingProducts() {
    try {
        const response = await fetch(`${RESTDB_URL}apikey=${RESTDB_API_KEY}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        const trendingProducts = products.sort((a, b) => b.likes - a.likes).slice(0, 5);
        displayTrendingProducts(trendingProducts);
    } catch (error) {
        console.error('Error fetching trending products:', error);
        document.getElementById('trendingProducts').innerHTML = 
            '<p>Error loading trending products. Please try again later.</p>';
    }
}

async function fetchGeneralProducts() {
    if (loading || !hasMore) return;
    
    const loadingElement = document.querySelector('.loading');
    loading = true;
    loadingElement.classList.remove('hidden');
    document.body.classList.add('no-scroll');


    try {
        const response = await fetch(`${RESTDB_URL}apikey=${RESTDB_API_KEY}&skip=${(page - 1) * 12}&max=12`);
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        
        if (products.length < 12) {
            hasMore = false;

        }

        displayGeneralProducts(products);
        page++;
    } catch (error) {
        console.error('Error fetching products:', error);
        loadingElement.textContent = 'Error loading products. Please try again later.';
    } finally {
        loading = false;
        setTimeout(() => {
            loadingElement.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 3000);
    }
}

function displayTrendingProducts(products) {
    const container = document.getElementById('trendingProducts');
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function displayGeneralProducts(products) {
    const container = document.getElementById('productsGrid');
    const productCards = products.map(product => createProductCard(product)).join('');
    container.insertAdjacentHTML('beforeend', productCards);
}

// Initial load
fetchTrendingProducts();
fetchGeneralProducts();


const skeletonBanner = document.querySelector('.banner-skeleton');
const banner = document.querySelector('.carousel');

setTimeout(() => {
    skeletonBanner.classList.add('hidden');
    banner.classList.remove('hidden');
}, 2000);



const dropdown = document.querySelector(".dropdown");

// Close dropdown if clicked outside
window.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) {
        dropdown.style.display = "none";
    }
});

async function updateLikeCount(listingID, likeCount) {
    try {
        // Make sure RESTDB_URL ends with a forward slash
        const url = `${RESTDB_URL}${listingID}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_API_KEY,
                // Add this header for CORS preflight requests
                'Accept': 'application/json'
            },
            body: JSON.stringify({ likes: likeCount })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update like count: ${response.statusText}`);
        }
        
        const updatedProduct = await response.json();
        console.log('Like count updated successfully:', updatedProduct);
    } catch (error) {
        console.error('Error updating like count:', error);
        // Re-throw the error so the calling code knows something went wrong
        throw error;
    }
}

// Use event delegation to handle like button clicks
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', async (event) => {
        const likeButton = event.target.closest('.like-button');
        if (likeButton) {
            const container = likeButton.closest('.like-container');
            const heartStroke = container.querySelector('.heart-stroke');
            const heartFilled = container.querySelector('.heart-filled');
            const likeCountElement = container.querySelector('.like-count');
            const listingID = document.getElementById('listingID').textContent;

            // Initialize like count from the span's inner text
            let likeCount = parseInt(likeCountElement.textContent, 10) || 0;

            // Check the current state using the display property
            const isLiked = heartStroke.style.display === 'none';

            if (isLiked) {
                // Unlike: Show stroked heart, hide filled heart, decrement count
                heartStroke.style.display = 'block';
                heartFilled.style.display = 'none';
                likeCount--;
            } else {
                // Like: Hide stroked heart, show filled heart, increment count
                heartStroke.style.display = 'none';
                heartFilled.style.display = 'block';
                likeCount++;
            }

            // Update the like count display
            likeCountElement.textContent = likeCount;

            // Update the like count on the server
            await updateLikeCount(listingID, likeCount);
        }
    });
});

// Select all product cards
const productCards = document.querySelectorAll('.product-card');

// Add click event listener to each product card
productCards.forEach(card => {
    card.addEventListener('click', (event) => {
        // Check if the click occurred on or within the "like-button"
        if (event.target.closest('.like-button, .condition-tag, .category-tag, .more')) {
            // Stop the event from propagating to the product card
            event.stopPropagation();
            return; // Exit to avoid redirection
        }

        // Redirect to another page
        window.location.href = 'product.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const moreButton = e.target.closest('.more svg');
        const moreReport = e.target.closest('.product-card')?.querySelector('.more-report');

        if (moreButton) {
            e.stopPropagation(); // Prevent this click from triggering the document click
            if (moreReport) {
                moreReport.style.display = moreReport.style.display === 'none' ? 'block' : 'none';
            }
        } else if (!e.target.closest('.more')) {
            document.querySelectorAll('.more-report').forEach(report => {
                report.style.display = 'none';
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Notification Dropdown
    const notificationIcon = document.querySelector('.notification');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const bell = document.getElementById('bell');

    notificationIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        const isDropdownVisible = notificationDropdown.style.display === 'block';
        notificationDropdown.style.display = isDropdownVisible ? 'none' : 'block';

        // Toggle bell icons
        const filled = 'M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6';
        const stroke = 'M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901';
        
        const pathData = isDropdownVisible
         ? filled // Selected
         : stroke; // Unselected

        bell.setAttribute('d', pathData);

    });
}); 

document.addEventListener('DOMContentLoaded', () => {
    // Profile Dropdown
    const profileIcon = document.getElementById('profile');
    const profileDropdown = document.getElementById('profileDropdown');
    const arrow = document.getElementById('arrow');

    profileIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        const isDropdownVisible = profileDropdown.style.display === 'block';
        profileDropdown.style.display = isDropdownVisible ? 'none' : 'block';
        
        // Toggle arrow rotation
        arrow.classList.toggle('rotate');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Profile tabs
    const setting = document.getElementById('setting');
    const settingIcon = document.getElementById('settingIcon');

    setting.addEventListener('mouseenter', () => {
        settingIcon.classList.toggle('rotate');
    });
});