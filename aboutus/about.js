let currentReview = 1;
const totalReviews = 2;

function showReview(reviewNumber) {
    for (let i = 1; i <= totalReviews; i++) {
        const review = document.getElementById(`review${i}`);
        if (i === reviewNumber) {
            review.style.display = "block";
        } else {
            review.style.display = "none";
        }
    }
}

function nextReview() {
    currentReview = currentReview < totalReviews ? currentReview + 1 : 1;
    showReview(currentReview);
}

function prevReview() {
    currentReview = currentReview > 1 ? currentReview - 1 : totalReviews;
    showReview(currentReview);
}

// Show the first review on page load
showReview(currentReview);
