// supportteam.js
document.addEventListener("DOMContentLoaded", function() {
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");

    // Function to handle button clicks
    function handleFeedbackClick(clickedBtn, otherBtn) {
        // Remove active state from other button
        otherBtn.style.background = "";
        otherBtn.style.color = "#007bff";

        // Add active state to clicked button
        clickedBtn.style.background = "#007bff";
        clickedBtn.style.color = "white";
    }

    // Add click event listeners to buttons
    if (yesBtn && noBtn) {
        yesBtn.addEventListener("click", function() {
            handleFeedbackClick(yesBtn, noBtn);
            console.log("User found article helpful");
        });

        noBtn.addEventListener("click", function() {
            handleFeedbackClick(noBtn, yesBtn);
            console.log("User did not find article helpful");
        });
    } else {
        console.error("Feedback buttons not found");
    }
});