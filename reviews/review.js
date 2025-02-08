// Configuration
const RESTDB_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/review';
const RESTDB_KEY = '677f31d996bc7400895f1141';

let currentRating = 0;

// Star rating system
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', (e) => {
        currentRating = parseInt(e.target.dataset.rating, 10) || 0;
        updateStars();
    });
});

function updateStars() {
    document.querySelectorAll('.star').forEach(star => {
        const rating = parseInt(star.dataset.rating, 10) || 0;
        star.style.color = rating <= currentRating ? '#ffd700' : '#ddd';
    });
}

// Submit review - Links review form to RestDB attributes
async function submitReview() {
    const username = document.getElementById('username')?.value.trim();
    const reviewText = document.getElementById('review-text')?.value.trim();

    if (!username || !reviewText || currentRating === 0) {
        alert('Please fill in all fields and select a rating');
        return;
    }

    // Correct attribute mapping for RestDB
    const review = {
        "review stars": currentRating,  // Links rating to "review stars"
        "text": reviewText,  // Links text input to "text"
        "madebyID": Math.floor(Math.random() * 1000),  // Generate a random user ID
        "aboutidMEMBER": 100,  // Static value
        "reviewid": Date.now(),  // Unique review ID
        "aboutIDOther": "hi"  // Static value
    };

    try {
        const response = await fetch(RESTDB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_KEY,
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Review submitted successfully!');
        document.getElementById('username').value = '';
        document.getElementById('review-text').value = '';
        currentRating = 0;
        updateStars();
        fetchReviews();
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again.');
    }
}

async function fetchReviews() {
    try {
        console.log('Fetching reviews...');
        
        const response = await fetch(`${RESTDB_URL}?max=50`, {  // Ensure valid count
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_KEY,
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reviews = await response.json();

        if (!Array.isArray(reviews)) {
            throw new Error('Invalid response format: Expected an array');
        }

        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = reviews.map(review => {
            const stars = parseInt(review["review stars"], 10) || 0;
            return `
                <div class="review-item">
                    <strong>Made by ID: ${review.madebyID || 'Unknown'}</strong>
                    <div>${'★'.repeat(stars) + '☆'.repeat(5 - stars)}</div>
                    <p>${review.text || 'No review text'}</p>
                    <small>Review ID: ${review.reviewid || 'N/A'}</small>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Error fetching reviews: ' + error.message);
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', fetchReviews);
