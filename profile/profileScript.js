const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const profileImage = document.getElementById('profileImage');
const saveButton = document.getElementById('saveButton');

uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

saveButton.addEventListener('click', () => {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        image: fileInput.files[0]
    };

    // In a real app, this would send the data to a server
    console.log('Saving changes:', formData);
    alert('Changes saved successfully!');
});