const imageGrid = document.querySelector('.image-grid');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');
let currentIndex = 0;
const totalImages = 5;

// Create dots
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
    imageGrid.style.transform = `translateX(-${currentIndex * 20}%)`;
    
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


document.addEventListener('DOMContentLoaded', () => {
    // Get the clickedProduct from localStorage
    const clickedProduct = JSON.parse(localStorage.getItem('clickedProduct'));

    if (clickedProduct) {
        // Update the HTML with the product details
        document.querySelector('.title').textContent = clickedProduct.title;
        document.querySelector('.description').textContent = clickedProduct.description;
        document.querySelector('.condition').textContent = clickedProduct.condition;
        document.querySelector('.price').textContent = `$${clickedProduct.price}`;
        document.querySelector('.location').textContent = clickedProduct.location

        // You can add product images from a predefined list or from the product data
        // Assuming you have images in clickedProduct or use a placeholder for this example
        const imageGrid = document.querySelector('.image-grid');
        imageGrid.innerHTML = ''; // Clear the existing images
        const imageUrls = [
            'https://picsum.photos/200/300', // Placeholder URLs, replace with real ones if available
            'https://picsum.photos/500/500',
            'https://picsum.photos/300/300'
        ];
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
    } else {
        // Handle case where no product is found in localStorage
        alert("No product data found.");
    }
});


const form = document.getElementById('distanceForm');
const output = document.getElementById('output');

// Initialize Autocomplete object
let originAutocomplete;

function initAutocomplete() {
    const originInput = document.getElementById('origin');
    
    originAutocomplete = new google.maps.places.Autocomplete(originInput);

    // Restrict the autocomplete to only return addresses
    originAutocomplete.setFields(['address_component']);
}

// Call initAutocomplete when the API is loaded
google.maps.event.addDomListener(window, 'load', initAutocomplete);

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
    
    // Ensure dealLocation is a valid string
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
            travelMode: google.maps.TravelMode.TRANSIT, // You can change this if needed (e.g., DRIVING)
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

                // Initialize the map centered on the product location
                map = new google.maps.Map(document.getElementById("map"), {
                    center: location,
                    zoom: 15, // Adjust zoom level as needed
                });

                // Add a marker at the product location
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

// Call initMap when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initMap();
});



