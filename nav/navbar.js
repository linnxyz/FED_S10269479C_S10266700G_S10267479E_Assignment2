// Initialize dropdowns when clicked
function initializeDropdowns() {
    document.addEventListener("click", (event) => {
        const isDropdown = event.target.closest(".dropdown");
        const isModal = event.target.closest("#referModal"); // Check if clicking inside modal

        // Close all dropdowns if clicking outside and NOT inside the modal
        if (!isModal) {
            document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
                if (!isDropdown || dropdown !== isDropdown.querySelector(".dropdown-content")) {
                    dropdown.classList.remove("show");
                }
            });

            // Toggle dropdown if clicking inside it
            if (isDropdown) {
                const dropdownContent = isDropdown.querySelector(".dropdown-content");
                if (dropdownContent) {
                    dropdownContent.classList.toggle("show");
                }
            }
        }
    });
}

// Open Refer a Friend Modal
function openReferModal() {
    const modal = document.getElementById("referModal");
    const input = document.getElementById("referralLink");
    const user = JSON.parse(localStorage.getItem("user"));

    if (modal) {
        modal.style.display = "flex";
        document.body.classList.add("modal-open"); // Prevent background scrolling
    }

    // Generate referral link with user ID
    if (input && user && user.id) {
        input.value = `http://127.0.0.1:5501/index.html?id=${user.id}`;
    } else {
        input.value = "User ID not found!";
    }
}

// Close Refer a Friend Modal
function closeReferModal() {
    const modal = document.getElementById("referModal");
    if (modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open"); // Restore background scrolling
    }
}

// Copy Referral Link to Clipboard
function copyReferral() {
    const input = document.getElementById("referralLink");
    if (input) {
        navigator.clipboard.writeText(input.value) // Modern method for copying
            .then(() => alert("Referral link copied!"))
            .catch((err) => console.error("Failed to copy: ", err));
    }
}

// Attach modal event listeners
function attachModalListeners() {
    const modal = document.getElementById("referModal");
    const closeBtn = document.querySelector(".close");
    const copyBtn = document.getElementById("copyLink");
    const referLink = document.getElementById("referFriend");

    if (modal) modal.style.display = "none"; // Hide modal initially

    if (referLink) {
        referLink.addEventListener("click", (event) => {
            event.preventDefault();
            openReferModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeReferModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (modal && event.target === modal) {
            closeReferModal();
        }
    });

    if (copyBtn) {
        copyBtn.addEventListener("click", copyReferral);
    }
}

// Load and inject navbar
async function loadNavbar() {
    try {
        const response = await fetch("/nav/navbar.html");
        const data = await response.text();

        const nav = document.querySelector("nav");
        if (!nav) return;

        nav.innerHTML = data;

        setTimeout(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            const usernameElement = nav.querySelector("#username");
            const loginButton = nav.querySelector(".login");
            const navIcons = nav.querySelector(".nav-icons");

            if (user) {
                if (usernameElement) usernameElement.textContent = user.name;
                if (navIcons) navIcons.style.display = "flex";
                if (loginButton) loginButton.style.display = "none";
            } else {
                if (navIcons) navIcons.style.display = "none";
                if (loginButton) loginButton.style.display = "block";
            }

            initializeDropdowns();
            attachModalListeners(); // Attach modal event listeners AFTER navbar loads
        }, 100);
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}

// Load navbar on page load
window.addEventListener("load", loadNavbar);
