const RESTDB_LISTINGS_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings';
const API_KEY = '677f31d996bc7400895f1141';


document.addEventListener('DOMContentLoaded', () => {
    // Get the clickedProduct from localStorage
    const clickedProduct = JSON.parse(localStorage.getItem('clickedProduct'));

    if (clickedProduct) {
        // Update the HTML with the product details
        document.querySelector('.title').textContent = clickedProduct.title;
        document.querySelector('.description').textContent = clickedProduct.description;
        document.querySelector('.condition').textContent = clickedProduct.condition;
        document.querySelector('.price').textContent = `$${clickedProduct.price}`;
        document.querySelector('.location').textContent = clickedProduct.location;
        document.querySelector('.seller-name').textContent = clickedProduct.sellerName;

        // Add product images from clickedProduct or use placeholder for this example
        const imageGrid = document.querySelector('.image-grid');
        imageGrid.innerHTML = ''; // Clear the existing images
        const imageUrls = clickedProduct.images.split(','); // Assuming images are stored as comma-separated URLs

        imageUrls.forEach(url => {
            const carouselSlide = document.createElement('div');
            carouselSlide.classList.add('carousel-slide');
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Product Image`;
            img.classList.add('carousel-image');
            carouselSlide.appendChild(img);
            imageGrid.appendChild(carouselSlide);
        });

        // Initialize the carousel
        initCarousel(imageUrls);
    } else {
        // Handle case where no product is found in localStorage
        alert("No product data found.");
    }
});

function initCarousel(imageUrls) {
    const imageGrid = document.querySelector('.image-grid');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    const totalImages = imageUrls.length;

    // Set the width of the image grid to accommodate all images
    imageGrid.style.width = `${totalImages * 100}%`;

    // Create dots dynamically based on the total number of images
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }

    function updateCarousel() {
        // Move the images in the grid to simulate a carousel
        imageGrid.style.transform = `translateX(-${currentIndex * (100 / totalImages)}%)`;

        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    });

    // Initial update
    updateCarousel();
}

// ... (rest of the code remains the same)

// Handle offer form submission
const offerForm = document.querySelector('.offer-form');
offerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const offerPrice = e.target.querySelector('.offer-input').value;
    alert(`Offer of $${offerPrice} submitted!`);
});

// Handle chat button click
const chatButton = document.querySelector('.chat-button');
chatButton.addEventListener('click', () => {
    alert('Opening chat with VintageFinder...');
});

// Initialize Autocomplete object for the origin address input
let originAutocomplete;

function initAutocomplete() {
    const originInput = document.getElementById('origin');
    originAutocomplete = new google.maps.places.Autocomplete(originInput);
    originAutocomplete.setFields(['address_component']);
}

google.maps.event.addDomListener(window, 'load', initAutocomplete);

const form = document.getElementById('distanceForm');
const output = document.getElementById('output');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    if (!origin) {
        output.innerText = 'Please enter an address.';
        return;
    }

    // Retrieve the dealLocation from localStorage
    const clickedProduct = JSON.parse(localStorage.getItem('clickedProduct'));
    if (!clickedProduct || !clickedProduct.location) {
        output.innerText = 'No deal location found in the product data.';
        return;
    }
    
    const destination = clickedProduct.location;
    if (typeof destination !== 'string' || destination.trim() === '') {
        output.innerText = 'Invalid deal location.';
        return;
    }

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.TRANSIT,
        },
        (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                const element = response.rows[0].elements[0];
                if (element.status === 'OK') {
                    const distance = element.distance.text;
                    const duration = element.duration.text;
                    output.innerHTML = `
                        <p><strong>Distance:</strong> ${distance}</p>
                        <p><strong>Estimated Time:</strong> ${duration}</p>
                    `;
                } else {
                    output.innerText = 'Error: Unable to calculate distance.';
                }
            } else {
                output.innerText = `Error: ${status}`;
            }
        }
    );
});

let map;

function initMap() {
    const clickedProduct = JSON.parse(localStorage.getItem('clickedProduct'));
    if (clickedProduct && clickedProduct.location) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: clickedProduct.location }, (results, status) => {
            if (status === "OK") {
                const location = results[0].geometry.location;
                map = new google.maps.Map(document.getElementById("map"), {
                    center: location,
                    zoom: 15, // Adjust zoom level as needed
                });

                new google.maps.Marker({
                    position: location,
                    map: map,
                    title: clickedProduct.title || "Product Location",
                });
            } else {
                console.error("Geocoding failed: " + status);
                document.getElementById("map").innerText = "Unable to load map.";
            }
        });
    } else {
        console.error("No location found for the clicked product.");
        document.getElementById("map").innerText = "No location available.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    async function fetchReviews() {
        try {
            const clickedProduct = JSON.parse(localStorage.getItem('clickedProduct'));
            if (!clickedProduct) return;
    
            const headers = {
                'x-apikey': API_KEY,
                'Content-Type': 'application/json'
            };
    
            // Fetch reviews about the listing
            const listingReviewsResponse = await fetch(
                `${RESTDB_LISTINGS_URL}/reviews?q={"aboutIDOther":"${clickedProduct._id}"}`,
                { headers }
            );
            const listingReviews = await listingReviewsResponse.json();
    
            // Fetch reviews about the seller
            const sellerReviewsResponse = await fetch(
                `${RESTDB_LISTINGS_URL}/reviews?q={"aboutIDMEMBER":"${clickedProduct.sellerID}"}`,
                { headers }
            );
            const sellerReviews = await sellerReviewsResponse.json();
    
            // Fetch all accounts for author information
            const accountsResponse = await fetch(
                `${RESTDB_LISTINGS_URL}/accounts`,
                { headers }
            );
            const accounts = await accountsResponse.json();
    
            // Combine and display reviews
            displayReviews(listingReviews, sellerReviews, accounts);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }
    
    function displayReviews(listingReviews, sellerReviews, accounts) {
        const reviewsContainer = document.querySelector('.reviews-container');
        const allReviews = [...listingReviews, ...sellerReviews];
    
        if (allReviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet</p>';
            return;
        }
    
        const reviewsHTML = allReviews.map(review => {
            const author = accounts.find(account => account._id === review.madebyID);
            const authorName = author ? author.name : 'Anonymous';
            const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
            const aboutText = review.aboutIDMEMBER ? 'Review about seller' : 'Review about listing';
    
            return `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${authorName}</span>
                        <span class="review-stars">${stars}</span>
                    </div>
                    <div class="review-content">${review.review}</div>
                    <div class="review-about">${aboutText}</div>
                </div>
            `;
        }).join('');
    
        reviewsContainer.innerHTML = reviewsHTML;
    }
    
    // Add this to your DOMContentLoaded event listener
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        fetchReviews();
    });
});
