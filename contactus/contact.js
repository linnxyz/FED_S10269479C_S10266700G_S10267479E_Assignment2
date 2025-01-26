const RESTDB_API_KEY = '677f31d996bc7400895f1141';
const RESTDB_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/contact';

document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    topic: document.getElementById('topic').value,
    message: document.getElementById('message').value,
  };

  try {
    // Send data to RESTDB
    const response = await fetch(RESTDB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': RESTDB_API_KEY,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to store data in the database.');
    }

    const data = await response.json();

    // Generate a receipt
    generateReceipt(data);
  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again.');
  }
});

// Function to generate a receipt
function generateReceipt(data) {
  const receiptDiv = document.getElementById('receipt');
  receiptDiv.innerHTML = `
    <h3>Receipt</h3>
    <p><strong>First Name:</strong> ${data.firstName}</p>
    <p><strong>Last Name:</strong> ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Topic:</strong> ${data.topic}</p>
    <p><strong>Message:</strong> ${data.message}</p>
    <p><strong>Submission ID:</strong> ${data._id}</p>
  `;
  receiptDiv.style.display = 'block';
}
