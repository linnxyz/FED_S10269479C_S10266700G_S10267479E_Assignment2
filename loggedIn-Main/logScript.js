// const RESTDB_API_KEY = '677f31d996bc7400895f1141';
// const RESTDB_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings?';
// let page = 1;
// let loading = false;
// let hasMore = true;

// function sanitizeHTML(str) {
//     const div = document.createElement('div');
//     div.textContent = str;
//     return div.innerHTML;
// }

// function createProductCard(product) {
//     const sanitizedProduct = {
//         title: sanitizeHTML(product.title),
//         description: sanitizeHTML(product.description),
//         condition: sanitizeHTML(product.condition),
//         category: sanitizeHTML(product.category),
//         price: Number(product.price).toFixed(2),
//         likes: parseInt(product.likes) || 0
//     };

//     return `
//         <div class="product-card">
//             <div class="product-image"></div>
//             <div class="product-info">
//                 <h3>${sanitizedProduct.title}</h3>
//                 <p class="product-description">${sanitizedProduct.description}</p>
//                 <div class="tags">
//                     <span class="condition-tag">${sanitizedProduct.condition}</span>
//                     <span class="category-tag">${sanitizedProduct.category}</span>
//                 </div>
//                 <div class="product-footer">
//                     <div class="price">$${sanitizedProduct.price}</div>
//                     <div class="likes">❤️ ${sanitizedProduct.likes}</div>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Rest of the JavaScript remains the same as in the previous version
// // [Previous JavaScript code for fetching and displaying products]

// async function fetchTrendingProducts() {
//     try {
//         const response = await fetch(`${RESTDB_URL}/products?sort=likes&max=10`, {
//             headers: {
//                 'x-apikey': RESTDB_API_KEY,
//                 'Content-Type': 'application/json'
//             }
//         });
//         if (!response.ok) throw new Error('Network response was not ok');
//         const products = await response.json();
//         displayTrendingProducts(products);
//     } catch (error) {
//         console.error('Error fetching trending products:', error);
//         document.getElementById('trendingProducts').innerHTML = 
//             '<p>Error loading trending products. Please try again later.</p>';
//     }
// }

// async function fetchGeneralProducts() {
//     if (loading || !hasMore) return;
    
//     const loadingElement = document.getElementById('loading');
//     loading = true;
//     loadingElement.style.display = 'block';

//     try {
//         const response = await fetch(`${RESTDB_URL}/products?skip=${(page - 1) * 12}&max=12`, {
//             headers: {
//                 'x-apikey': RESTDB_API_KEY,
//                 'Content-Type': 'application/json'
//             }
//         });
//         if (!response.ok) throw new Error('Network response was not ok');
//         const products = await response.json();
        
//         if (products.length < 12) {
//             hasMore = false;
//         }

//         displayGeneralProducts(products);
//         page++;
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         loadingElement.textContent = 'Error loading products. Please try again later.';
//     } finally {
//         loading = false;
//         loadingElement.style.display = hasMore ? 'none' : 'block';
//         loadingElement.textContent = hasMore ? 'Loading more products...' : 'No more products to load';
//     }
// }

// function displayTrendingProducts(products) {
//     const container = document.getElementById('trendingProducts');
//     container.innerHTML = products.map(product => createProductCard(product)).join('');
// }

// function displayGeneralProducts(products) {
//     const container = document.getElementById('productsGrid');
//     const productCards = products.map(product => createProductCard(product)).join('');
//     container.insertAdjacentHTML('beforeend', productCards);
// }

// let searchTimeout;
// document.getElementById('searchInput').addEventListener('input', (e) => {
//     clearTimeout(searchTimeout);
//     searchTimeout = setTimeout(async () => {
//         const searchTerm = e.target.value.trim();
//         if (searchTerm) {
//             try {
//                 const response = await fetch(
//                     `${RESTDB_URL}/products?q={"$or":[{"title":{"$regex":"${searchTerm}"}},{"description":{"$regex":"${searchTerm}"}}]}`,
//                     {
//                         headers: {
//                             'x-apikey': RESTDB_API_KEY,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );
//                 if (!response.ok) throw new Error('Network response was not ok');
//                 const products = await response.json();
//                 document.getElementById('productsGrid').innerHTML = 
//                     products.map(product => createProductCard(product)).join('');
//             } catch (error) {
//                 console.error('Error searching products:', error);
//             }
//         } else {
//             document.getElementById('productsGrid').innerHTML = '';
//             page = 1;
//             hasMore = true;
//             fetchGeneralProducts();
//         }
//     }, 300);
// });

// const observer = new IntersectionObserver((entries) => {
//     if (entries[0].isIntersecting && !loading && hasMore) {
//         fetchGeneralProducts();
//     }
// }, { rootMargin: '200px' });

// observer.observe(document.getElementById('loading'));

// // Initial load
// fetchTrendingProducts();
// fetchGeneralProducts();
// Get references to dropdown elements
const dropdownButton = document.getElementById("dropdownButton");
const dropdownContent = document.getElementById("dropdownContent");
const dropdownItems = document.querySelectorAll(".dropdown-item");

// Toggle dropdown visibility on button click
dropdownButton.addEventListener("click", () => {
    dropdownContent.parentElement.classList.toggle("open");
});

// Handle item selection
dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        const selectedValue = event.target.getAttribute("data-value");
        const selectedText = event.target.textContent;

        // Update the button text
        dropdownButton.textContent = selectedText;

        // Log the selected value (or use it for other actions)
        console.log("Selected Condition:", selectedValue);

        // Close the dropdown
        dropdownContent.parentElement.classList.remove("open");
    });
});

// Close dropdown if clicked outside
window.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) {
        dropdownContent.parentElement.classList.remove("open");
    }
});

// Select all like containers
const likeContainers = document.querySelectorAll('.like-container');

likeContainers.forEach(container => {
    const likeButton = container.querySelector('.like-button');
    const heartStroke = container.querySelector('.heart-stroke');
    const heartFilled = container.querySelector('.heart-filled');
    const likeCountElement = container.querySelector('.like-count');

    // Initialize like count from the span's inner text
    let likeCount = parseInt(likeCountElement.textContent, 10) || 0;

    // Add click event listener to the button
    likeButton.addEventListener('click', () => {
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




