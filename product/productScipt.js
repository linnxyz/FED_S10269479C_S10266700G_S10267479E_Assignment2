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