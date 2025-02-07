const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const user = JSON.parse(localStorage.getItem('user'));
const username = document.getElementById("username");  // Find the username element by ID
const date = document.getElementById("joinedOn");
const email = document.getElementById("email");

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

username.textContent = user.name;  // Set the username text
date.textContent = new Date(user.createdAt).toLocaleDateString();  // Set the account creation date text
email.textContent = user.email; // Set the email text

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});