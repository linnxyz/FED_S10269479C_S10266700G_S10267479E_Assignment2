const createScratchCard = (canvasId, color) => {
    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext('2d');
    let isDragging = false;
    let confettiShown = false; // To ensure confetti is shown only once

    const init = () => {
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const scratch = (x, y) => {
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(x, y, 24, 0, Math.PI * 2);
        context.fill();
    };

    const getClearedPercentage = () => {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearedPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) { // Check alpha channel
            if (pixels[i] === 0) clearedPixels++;
        }

        const clearedPercentage = (clearedPixels / (pixels.length / 4)) * 100;
        return clearedPercentage;
    };

    const checkCleared = () => {
        const clearedPercentage = getClearedPercentage();
        if (clearedPercentage >= 80 && !confettiShown) {
            confettiShown = true;

            // Show full-screen circular confetti animation
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        angle: 360, // Circular spread
                        spread: 360, // Full circular coverage
                        origin: {
                            x: Math.random(), // Random x-coordinate
                            y: Math.random()  // Random y-coordinate
                        }
                    });
                }, i * 150); // Stagger bursts
            }

            // Remove event listeners
            canvas.removeEventListener('mousedown', startScratch);
            canvas.removeEventListener('mousemove', moveScratch);
            canvas.removeEventListener('mouseup', stopScratch);
            canvas.removeEventListener('mouseleave', stopScratch);
        }
    };

    const startScratch = (event) => {
        isDragging = true;
        scratch(event.offsetX, event.offsetY);
    };

    const moveScratch = (event) => {
        if (isDragging) {
            scratch(event.offsetX, event.offsetY);
            checkCleared();
        }
    };

    const stopScratch = () => {
        isDragging = false;
    };

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', moveScratch);
    canvas.addEventListener('mouseup', stopScratch);
    canvas.addEventListener('mouseleave', stopScratch);

    init();
};


const noReward = document.getElementById('noReward');
const container = document.getElementById('container');

if (localStorage.getItem('code') === undefined){
    noReward.style.display = none;
    container.style.display = none;
}


// Create scratch card
createScratchCard('scratch-card1', 'blue');




// Include confetti library
(function() {
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
    document.head.appendChild(script);
})();
