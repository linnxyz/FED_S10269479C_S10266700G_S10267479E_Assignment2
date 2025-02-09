document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const topic = document.getElementById("topic").value;
    const inquiry = document.getElementById("message").value;

    // Prepare data object
    const contactData = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phonenum: phone,
      topic: topic,
      inquiry: inquiry
    };

    // Send data to RestDB
    fetch("https://mokesellcustomers-cfe3.restdb.io/rest/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": "677f31d996bc7400895f1141", // Replace with a secure way to handle API keys
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(contactData)
    })
      .then(response => response.json())
      .then(data => {
        alert("Your message has been sent!");
        form.reset(); // Clear form after submission
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});
