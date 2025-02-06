// Initialize the dropdowns (not related to the issue, but just in case it's relevant)
function initializeDropdowns() {
    const profileDropdown = document.querySelector('.profile.dropdown');
    const notificationDropdown = document.querySelector('.notification.dropdown');

    if (profileDropdown) {
        profileDropdown.addEventListener('click', (e) => {
            toggleDropdown(profileDropdown);
            e.stopPropagation();
        });
    }

    if (notificationDropdown) {
        notificationDropdown.addEventListener('click', (e) => {
            toggleDropdown(notificationDropdown);
            e.stopPropagation();
        });
    }
    document.addEventListener('click', closeAllDropdowns);
}

function toggleDropdown(dropdown) {
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    allDropdowns.forEach(content => {
        if (content !== dropdown.querySelector('.dropdown-content')) {
            content.classList.remove('show');
        }
    });

    const content = dropdown.querySelector('.dropdown-content');
    if (content) {
        content.classList.toggle('show');
    }
}

function closeAllDropdowns(event) {
    if (!event.target.closest('.dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
}

// Function to load and inject the navbar, and display the username if available
async function loadNavbar() {
    try {
        const response = await fetch("/nav/navbar.html");  // Load the navbar HTML
        const data = await response.text();  // Get the HTML content

        const nav = document.querySelector("nav");  // Select the <nav> element
        if (nav) {
            nav.innerHTML = data;  // Inject the navbar HTML into the <nav> element

            // Check if user data is stored in localStorage
            const user = JSON.parse(localStorage.getItem("user"));

            // Get the login button from the navbar
            const loginButton = nav.querySelector(".login");

            if (user) {
                // User is logged in, update the username element
                const usernameElement = nav.querySelector("#username");  // Find the username element by ID
                if (usernameElement) {
                    usernameElement.textContent = user.name;  // Set the username text
                }

                // Show nav icons (if you have them)
                const navIcons = nav.querySelector(".nav-icons");
                if (navIcons) {
                    navIcons.style.display = "flex";
                }

                // Hide the login button when the user is logged in
                if (loginButton) {
                    loginButton.style.display = "none";  // Hide the login button
                }

            } else {
                // User is not logged in, hide nav icons
                const navIcons = nav.querySelector(".nav-icons");
                if (navIcons) {
                    navIcons.style.display = "none";
                }

                // Show the login button when the user is not logged in
                if (loginButton) {
                    loginButton.style.display = "block";  // Show the login button
                }
            }

            initializeDropdowns();  // Reinitialize dropdowns
        }
    } catch (error) {
        console.error("Error loading navbar:", error);  // Handle any errors
    }
}



// Call loadNavbar when the page is loaded
window.addEventListener('load', loadNavbar);
