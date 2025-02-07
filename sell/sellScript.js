// Constants
const RESTDB_LISTINGS_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings';
const API_KEY = '677f31d996bc7400895f1141';
const MAX_IMAGES = 5;
const MAX_WORDS = 100;

// State
const state = {
    uploadedImages: [],
    coverImageIndex: 0
};

// DOM Elements
const elements = {
    form: document.getElementById('listingForm'),
    imageUpload: document.getElementById('imageUpload'),
    imageGrid: document.getElementById('imageGrid'),
    description: document.getElementById('description'),
    wordCount: document.getElementById('wordCount'),
    submitButton: document.getElementById('submitButton'),
    conditionItems: document.querySelectorAll('.condition-item'),
    categoryItems: document.querySelectorAll('.category-item'),
    conditionInput: document.getElementById('condition'),
    categoryInput: document.getElementById('category'),
    title: document.getElementById('title'),
    price: document.getElementById('price')
};

// Image Handling Functions
function handleImageUpload(event) {
    const files = Array.from(event.target.files);

    if (state.uploadedImages.length + files.length > MAX_IMAGES) {
        alert(`Maximum ${MAX_IMAGES} images allowed`);
        return;
    }

    Promise.all(files.map(readFileAsDataURL))
        .then(() => {
            state.uploadedImages.push(...files);
            updateImageGrid();
        })
        .catch(error => {
            console.error('Error uploading images:', error);
            alert('Error uploading one or more images');
        });
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve();
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function createImageElement(file, index, isCover = false) {
    const container = document.createElement('div');
    container.className = `image-container${isCover ? ' cover' : ''}`;

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    if (!isCover) {
        img.onclick = () => setCoverImage(index);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-image';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeImage(index);
    };

    container.append(img, removeBtn);
    return container;
}

function updateImageGrid() {
    elements.imageGrid.innerHTML = '';

    // Add cover image
    if (state.uploadedImages.length > 0) {
        const coverElement = createImageElement(state.uploadedImages[state.coverImageIndex], state.coverImageIndex, true);
        elements.imageGrid.appendChild(coverElement);
    }

    // Add other images
    state.uploadedImages.forEach((file, index) => {
        if (index !== state.coverImageIndex) {
            const imageElement = createImageElement(file, index);
            elements.imageGrid.appendChild(imageElement);
        }
    });
}

function setCoverImage(index) {
    state.coverImageIndex = index;
    updateImageGrid();
}

function removeImage(index) {
    state.uploadedImages.splice(index, 1);
    if (state.coverImageIndex >= state.uploadedImages.length) {
        state.coverImageIndex = Math.max(0, state.uploadedImages.length - 1);
    }
    updateImageGrid();
}

// Form Handling Functions
function updateWordCount() {
    const words = elements.description.value.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;
    elements.wordCount.textContent = `${count}/${MAX_WORDS} words`;

    const isOverLimit = count > MAX_WORDS;
    elements.wordCount.classList.toggle('over-limit', isOverLimit);
    elements.submitButton.disabled = isOverLimit;
}

function setupSelectors(items, input) {
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            input.value = item.dataset.category || item.dataset.condition;
        });
    });
}

// Flag to check if the form is already being processed
let isSubmitting = false;

async function handleListingSubmit(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    // Prevent submitting again if already submitting
    if (isSubmitting) return;

    // Mark the form as submitting
    isSubmitting = true;

    // Disable the submit button to prevent multiple submissions
    elements.submitButton.disabled = true;

    const meetupCheckbox = document.getElementById("meetup");
    const deliveryCheckbox = document.getElementById("delivery");
    const dealLocationInput = document.getElementById("dealLocation");

    // Only include dealLocation if meetup is selected
    const dealLocation = meetupCheckbox.checked ? dealLocationInput.value : "NA";
    const delivery = deliveryCheckbox.checked ? true : false;

    const formData = {
        title: elements.title.value,
        description: elements.description.value,
        price: elements.price.value,
        category: elements.categoryInput.value,
        condition: elements.conditionInput.value,
        dealLocation: dealLocation,
        delivery: delivery
    };

    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        // Re-enable the submit button if validation fails
        elements.submitButton.disabled = false;
        isSubmitting = false; // Mark as not submitting anymore
        return;
    }

    try {
        const response = await fetch(RESTDB_LISTINGS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            },
            body: JSON.stringify({
                ...formData,
                coverImage: state.uploadedImages[state.coverImageIndex],
                images: state.uploadedImages
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create listing: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        alert("Listing created successfully!");
        resetForm();

    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    } finally {
        // Re-enable the submit button after the request is complete
        elements.submitButton.disabled = false;
        isSubmitting = false; // Mark as not submitting anymore
    }
}


function validateForm(formData) {
    const errors = [];

    if (!formData.title.trim()) errors.push("Please enter a title");
    if (!formData.description.trim()) errors.push("Please enter a description");
    if (!formData.price || formData.price <= 0) errors.push("Please enter a valid price");
    if (!formData.category) errors.push("Please select a category");
    if (!formData.condition) errors.push("Please select a condition");

    const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > MAX_WORDS) errors.push(`Description must be ${MAX_WORDS} words or less`);

    return errors;
}

function resetForm() {
    elements.form.reset();
    elements.conditionItems.forEach(i => i.classList.remove('selected'));
    elements.categoryItems.forEach(i => i.classList.remove('selected'));
    elements.conditionInput.value = '';
    elements.categoryInput.value = '';
    state.uploadedImages = [];
    state.coverImageIndex = 0;
    updateImageGrid();
    updateWordCount();
}

// Event Listeners
function initializeForm() {
    elements.imageUpload.addEventListener('change', handleImageUpload);
    elements.description.addEventListener('input', updateWordCount);
    elements.form.addEventListener('submit', handleListingSubmit);
    setupSelectors(elements.conditionItems, elements.conditionInput);
    setupSelectors(elements.categoryItems, elements.categoryInput);
}
document.getElementById("delivery").addEventListener("change", toggleLocationField);
document.getElementById("meetup").addEventListener("change", toggleLocationField);

function toggleLocationField() {
    const meetUpChecked = document.getElementById("meetup").checked;
    const dealLocationGroup = document.getElementById("dealLocationGroup");

    // If "Meet Up" is checked, show the deal location input
    if (meetUpChecked) {
        dealLocationGroup.classList.remove("hidden");
    } else {
        dealLocationGroup.classList.add("hidden");
    }
}

function initAutocomplete() {
    const originInput = document.getElementById('dealLocation');

    if (!originInput) {
        console.error("Input field not found!");
        return;
    }

    originAutocomplete = new google.maps.places.Autocomplete(originInput, {
        // Remove 'types' or set to 'establishment' to include places
        componentRestrictions: { country: "SG" } // Restrict to Singapore
    });
}

// Ensure the script loads before initializing
document.addEventListener('DOMContentLoaded', initAutocomplete);

// Initialize the form
document.addEventListener('DOMContentLoaded', initializeForm);