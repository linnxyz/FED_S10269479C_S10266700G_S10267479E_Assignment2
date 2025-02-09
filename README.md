# **MokeSell**
![enter image description here](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739095071/nyygwffiqbrlyyuc0kd4.png)

**MokeSell** is a web-based marketplace platform that allows users to buy and sell products online. The platform provides a structured way for users to list items, browse available products, and find great deals with ease.

This repository contains the source code for MokeSell, including the frontend and backend implementation. It is designed to demonstrate web development concepts such as **APIs, database implementations , and responsive UI design**.

🎨 This project is built using:

-   **HTML, CSS, JavaScript** for the frontend
-   **RestDB** for database

This documentation explains the functionality,  structure and the technology used in the project. 


# 📝 Project Breakdown & Implementation


## 1. Main Page (index.html)
**Contributor/Author**: Linn Thit Aung

The **index page** serves as the main landing page for the Mokesell website. This page is crucial because it offers the first impression of the website and acts as a central hub for users to explore various products.
We use **RestDB** as our database to store all our data because it is flexible and easy to use.

### Extracting Data from RestDB

**RestDB** allows for easy management and retrieval of product details like name, description, price, and images, all of which are displayed on the index page for the users to explore. Here’s how our data extraction works:

#### Setting Up RestDB  API

RestDB provides an API endpoint that allows us to interact with our database and retrieve data using simple HTTP requests (e.g., GET requests). In this project, we set up RestDB to store all the product data, including the product name, price, description, and image URLs. The API endpoint URL is configured to point to the specific collection of product data in the database.

For example, our endpoint look something like this:
```
https://mokesell-database-name.restdb.io/rest/listings
```

#### Fetching Data from RestDB Using JavaScript

To display the product data dynamically, we use JavaScript’s `fetch()` method to send a GET request to the RestDB API endpoint. This fetch request retrieves the product information stored in the database and returns it as JSON data, which can then be processed and displayed on the index page.

Here’s an example of how the data is fetched:

```javascript
async function fetchProducts() {
    if (loading || !hasMore) return;  // Prevent if already loading or no more products
    loading = true;
    try {
        const response = await fetch(`${RESTDB_URL}apikey=${RESTDB_API_KEY}&skip=${(page - 1) * 12}&max=12`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        if (products.length < 12) hasMore = false;  // Stop fetching more

        displayProducts(products);  // Display fetched products
        page++;  // Move to the next page
    } catch (error) {
        console.error(error);
    } finally {
        loading = false;
    }
}
```

In the above code:

-   We use `fetch()` to make an API request to the RestDB endpoint.
-   The API key is used for authentication to ensure that only authorized users can access the data.
-   The response is processed with `.json()` to convert the JSON data into a JavaScript object.
-   If the request is successful, the `products` (which contains the product information) is passed to the `displayProducts()` function.


#### Displaying Product Cards on the Index Page

Once the product data is fetched, we need to dynamically display it on the index page. The `createProductCard()` function is responsible for this task, where it loops through the fetched product data and creates a new product card for each item.

Here’s a simplified breakdown of how the `createProductCard()` function works:

```javascript
function createProductCard(product) {
    const sanitizedProduct = {
        title: sanitizeHTML(product.title),
        description: truncateText(sanitizeHTML(product.description), 15),
        price: Number(product.price).toFixed(2),
        coverImage: sanitizeHTML(product.coverImage),
        likes: parseInt(product.likes) || 0
    };

    return `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${sanitizedProduct.coverImage}')"></div>
            <div class="product-info">
                <h3>${sanitizedProduct.title}</h3>
                <p class="product-description">${sanitizedProduct.description}</p>
                <div class="price">$${sanitizedProduct.price}</div>
                <div class="like-container">
                    <span class="like-count">${sanitizedProduct.likes}</span>
                </div>
            </div>
        </div>
    `;
}
```

In this code:

-   The `product` object contains all the necessary details for a product (such as title, description, price, etc.).
-   We sanitize the product's data to prevent potential security issues with untrusted content.
-   We create a product card by inserting the sanitized product information into an HTML structure.
-   The `product-card` element is then appended to the parent container (`product-container`) on the page.

This results in a series of product cards being generated dynamically from the fetched product data and displayed in the user interface.

#### Error Handling

When interacting with external APIs, it’s important to handle potential errors, such as network failures or invalid responses from the server. In the `fetch()` request, we included a `.catch()` block to log any errors that might occur during the request process.

Additionally, it’s good practice to provide the user with feedback if the products cannot be loaded. This can be done by displaying an error message on the page in case the `fetch()` request fails.

Here's our example usage:

```javascript
} catch (error) {
	console.error('Error fetching products:',  error);
	document.getElementById('products').innerHTML  =
	'<p>Error loading products. Please try again later.</p>';
}
```

#### Additions:
There is 2 sections in the index page to display products, **Trending** and **All**. Trending section only show the top 10 products with the most likes and All section show everything with no specific sorting. Index page also feature **Reviews** given to MokeSell by users, **FAQs**, and **Footer**.

## 2. Product Page (product.html)
**Contributor/Author**: Linn Thit Aung

The **Product Page** is where users can view detailed information about a specific product after selecting it from the index page. When a user clicks on a product, its data is stored in localStorage under `clickedProduct`, allowing the details to persist when navigating to `product.html`.

### Storing Clicked Product Data

When a product is clicked on the index page, its details (such as title, description, price, image, and seller info) are stored in `localStorage` using JavaScript like this:

```javascript
function handleProductClick(product) {
    localStorage.setItem('clickedProduct', JSON.stringify(product));
    window.location.href = 'product.html'; // Navigate to the product page
}
```

### Retrieving and Displaying Product Data

On `product.html`, the stored data is retrieved and displayed dynamically:

```javascript
document.addEventListener('DOMContentLoaded',  ()  =>  {
	// Get the clickedProduct from localStorage
	const  clickedProduct  =  JSON.parse(localStorage.getItem('clickedProduct'));
	if (clickedProduct) {
		// Update the HTML with the product details
		document.querySelector('.title').textContent  =  clickedProduct.title;
		document.querySelector('.description').textContent  =  clickedProduct.description;
		document.querySelector('.condition').textContent  =  clickedProduct.condition;
		document.querySelector('.price').textContent  =  `$${clickedProduct.price}`;
		document.querySelector('.location').textContent  =  clickedProduct.location;
		document.querySelector('.seller-name').textContent  =  clickedProduct.sellerName;
```

### Google Maps Integration

To enhance the user experience, we integrated the **Google Maps API** to display the meet-up location set by the seller for each product. Additionally, we allow buyers to enter their desired location, and using the **Google Distance Matrix API**, we calculate the distance and estimated travel time using public transport.

![enter image description here](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739108155/rrh2n9kuitf4artoaohh.png)
#### Displaying the Seller’s Meet-Up Location

Each product listing includes a meet-up location specified by the seller. Using the **Google Maps JavaScript API**, we display this location as a marker on an embedded map.

#### Fetching and Displaying the Meet-Up Location

```javascript
let map;
function initMap() {
    const clickedProduct = JSON.parse(localStorage.getItem('clickedProduct'));
    if (clickedProduct && clickedProduct.location) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: clickedProduct.location }, (results, status) => {
            if (status === "OK") {
                const location = results[0].geometry.location;
                map = new google.maps.Map(document.getElementById("map"), {
                    center: location,
                    zoom: 15, // Adjust zoom level as needed
                });
                new google.maps.Marker({
                    position: location,
                    map: map,
                    title: clickedProduct.title || "Product Location",
                });
            }
```
The above code is part of the implementation to initialize the Google Map on the product page. It retrieves the selected product’s location from localStorage, uses the **Google Geocoding API** to convert the address into coordinates, and then initializes a map centered on that location. A marker is also placed to indicate the seller’s meetup point for the product.

#### Allowing Buyers to Enter Their Desired Location

To help buyers plan their travel, we provide an input field where they can enter their location. Once they input their address, we use the **Google Places Autocomplete API** to suggest valid locations.

```html
<input  type="text"  id="origin"  placeholder="Enter an address to calculate distance from the meet up location"  required  />
<button  type="submit">Calculate Distance</button>
```
We used **Google Places Autocomplete API** in the create listing (sell.html) as well. To read more about how it works, [Go to Create Listing (sell.html)](#3-create-listing-sellhtml)
 
#### Calculating Distance and Travel Time

When the buyer enters their location, we use the **Google Distance Matrix API** to calculate the distance and estimated travel time using public transport.

Part of the code looks something like this:

```javascript
const  service  =  new  google.maps.DistanceMatrixService();
service.getDistanceMatrix(
	{
		origins: [origin],
		destinations: [destination],
		travelMode:  google.maps.TravelMode.TRANSIT,
	},
```
In this code:
-   `DistanceMatrixService` initializes the Google Maps Distance Matrix API, which helps calculate distances and travel times.
-    These parameters `origins` and  `destinations` take in the seller's meetup location and the buyer's entered location.
-   `travelMode: google.maps.TravelMode.TRANSIT` specifies that the estimated time should be calculated using public transport.

## 3. Create Listing (sell.html)
**Contributor/Author**: Linn Thit Aung

This page allows users to create new product listings by entering relevant details such as product title, description, price, images, and a preferred meetup location etc. **Icons** are more prominently used in the design to make the form visually appealing and easy to understand.

![Product Category Screenshot](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739110563/t01sgc9yhnusa8erbn2c.png)
### Google Places Autocomplete Integration
The **Google Places Autocomplete** feature is implemented in the `dealLocation`. It helps users by providing location suggestions as they type, making it faster and easier to select a valid meetup location. By restricting the suggestions to **Singapore**, the feature ensures that users only see relevant locations. This is useful for improving accuracy, reducing errors, and enhancing the overall user experience when creating a listing.

![enter image description here](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739110714/fttbqhyo80wpqxfanqmi.png)
```javascript
function initAutocomplete() {
    const originInput = document.getElementById('dealLocation');

    if (!originInput) {
        console.error("Input field not found!");
        return;
    }

    originAutocomplete = new google.maps.places.Autocomplete(originInput, {
        componentRestrictions: { country: "SG" } // Restrict to Singapore
    });
}
```
In above code:
-   `originInput` stores the input element with the ID `dealLocation`, which is where users enter their meetup location.
 -   `originAutocomplete = new google.maps.places.Autocomplete(originInput, {...});` initializes the Google Maps Places Autocomplete functionality on the input field. This provides suggestions for places as the user types.
	-   `componentRestrictions: { country: "SG" }` restricts the autocomplete to locations within Singapore, ensuring that users are selecting valid, local locations.

### Sending listing data to RestDB

[Go to Create Listing RestDB Implementation by Scott](#fundamentals-of-restdb)

## 4. Log In / Register (login.html)

**Contributor/Author**: Linn Thit Aung

This page allows users to either create a new account or log in to an existing one. This page serves as the gateway for users to access their personalized experience on the site, including features like managing listings, viewing saved items, and making purchases.

-   **User Registration**: New users can sign up by providing basic information such as their email and password.
    
-   **User Login**: Existing users can log in by entering their credentials. The login form checks the entered information against the database to authenticate the user and grant them access to their account.

### Password Hashing

To securely store the passwords in our database, **SHA-256** hashing algorithm is applied on the password before being sent out to the database.

```javascript
async  function  hashPassword(password)  {
	// Use SHA-256 for hashing
	const  encoder  =  new  TextEncoder();
	const  data  =  encoder.encode(password);
	const  hashBuffer  =  await  crypto.subtle.digest('SHA-256',  data);
	
	// Convert buffer to hex string
	const  hashArray  =  Array.from(new  Uint8Array(hashBuffer));
	const  hashHex  =  hashArray.map(b  =>  b.toString(16).padStart(2,  '0')).join('');
	return  hashHex;
}
```
#### Why we chose SHA-256?

**SHA-256** (Secure Hash Algorithm 256-bit) is part of the SHA-2 family of hashing algorithms, which are designed by the **National Security Agency (NSA)**. It produces a 256-bit (32-byte) hash, which is considered very secure. It is also resistant to various types of cryptographic attacks like brute force, collision, and preimage attacks. It has not yet been broken in terms of its security, making it a reliable choice for cryptography.

## 5. Scratch Card Feature (reward.html)
**Contributor/Author**: Linn Thit Aung

![Scratch Card](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739116294/fi8kdb4vowub4cn1niha.png)
The **Scratch Card** feature on the reward page offers an interactive and fun way for users to reveal a reward code. This is achieved by using an HTML `<canvas>` element combined with JavaScript to create a scratch-off effect. Here’s how it works:

-   **Canvas for Scratch Card**: The `<canvas>` element is used to display a scratch card image. The user can interact with the canvas using their mouse or finger (on mobile) to "scratch off" the grey layer that covers the reward code.
    
-   **Scratch Mechanism**: When the user drags over the upper canvas layer, JavaScript detects the mouse or touch movements and erases the layer to reveal the underlying reward code.
    
-   **Confetti Animation**: Once the code is revealed, a fun confetti animation is triggered to celebrate the user’s success. This adds a lively touch to the reward process, making it more enjoyable for the user.
   
Here’s an outline of how this is implemented in code:

```html
<div  class="scratch-container">
<div  class="scratch-card">
	<div  class="code">CODE HERE<br><span>DESCRIPTION HERE</span></div>
	</div>
	<canvas  id="scratch-card1"  width="300"  height="100"></canvas>
</div>
```
```javascript
const  scratch  = (x,  y) => {
	context.globalCompositeOperation  =  'destination-out';
	context.beginPath();
	context.arc(x,  y,  24,  0,  Math.PI  *  2);
	context.fill();
};
```

## 6. **Referral Link Feature**
**Contributor/Author**: Linn Thit Aung

The **Referral Link** feature is designed to encourage users to invite others to the platform and rewards them for it.

![Refer a friend](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739116813/l9avvjmabraqaq6ulwih.png)

 - [x] **Referral Link Generation**: When a user visits the referral page, a unique referral link is generated for them. This link includes their user ID appended to the URL (e.g., `www.mokesell.com?id=12345`).
    
 - [x] **Referral Landing Page**: The code recognizes the id in the URL and shows a pop up to process further advantages for both, the referrer and the referee.
    
 - [ ] **Tracking Referrals**: On the back-end, the referral ID can be used to track which user referred a new visitor. The referred user may receive rewards (e.g., discounts) for signing up through the referral link. (TO BE IMPLEMENTED)

---
 
## Fundamentals of RestDB
**Contributor/Author**:Tan Si Ming Scott
### 📝 RestDB Data Manipulation
Now that we have fetched the data using the **RestDB** api, we have to add on, modify or even delete the queried data.This can be done in many ways.
### POST Method
To create an entry in the collection of your choosing, the **POST** method is used. The **POST** method adds entered information into the database if there is a corresponding field. In our case, the **POST** method is used to allow the users of our website to create their product listings, and for those listings to be recorded inside our database.

Here is an example of a framework code we used using the **POST** method:
```javascript
async  function  handleListingSubmit(event) {

event.preventDefault();
const title=document.getElementById('title').value.trim();
const description=document.getElementById('description').value.trim();
const price=document.getElementById('price').value.trim();
const category=document.getElementById('category').value;
const condition=document.getElementById('condition').value;
const  response=await fetch(RESTDB_LISTINGS_URL,{
method:  'POST',
headers: {
'Content-Type':  'application/json',
'x-apikey':  API_KEY
},
body:  JSON.stringify({
title,
description,
category,
price,
condition,
}}
```
The above code defines the values by referencing the accompanying IDs in the HTML form, before fetching the url and posting an entry into the collection with the specified values in each variable.


### PATCH Method
The **PATCH** method is used when you want to modify an existing entry inside the **RestDB** database.The **PATCH** method allows you to override existing data in entries and/or add new data into empty fields for the entry. The **PATCH** method is used to enable our users to change the details of their listing, and have that change reflected in the database.

Here is an example of a framework code we made using the **PATCH** method:
```javascript
async function handleModifySubmit(event) {
const listingID = document.getElementById('ListingID').value.trim();
const title = document.getElementById('newTitle').value.trim();
const description = document.getElementById('newDescription').value.trim();
const price = parseFloat(document.getElementById('newPrice').value.trim());
const category = document.getElementById('newCategory').value.trim();
const condition = document.getElementById('newCondition').value.trim();
try{
const modifyUrl =`${RESTDB_LISTINGS_URL}/${recordId}`;
const modifyResponse = await  fetch(modifyUrl, {
method: 'PATCH',
headers: {
'Content-Type':  'application/json',
'x-apikey':  API_KEY
},
body: JSON.stringify({
title,
description,
price,
category,
condition
});
```
The above code defines new values for the fields that are being overridden, with a predefined function outside this code to query the database and reference the given id. It then changes the entry based on the information given.

### Delete Method

The **DELETE** Method is used when you want to delete an entry from a collection.The **DELETE** Method allows our users to delete their listings from the database, if they are no longer selling the product.

Here is an example of a framework code we made using the **DELETE** Method:
```javascript
const ListingID = document.getElementById('ListingID').value.trim();
try{
const deleteUrl = `${RESTDB_LISTINGS_URL}?q={"listingID":"${ListingID}"}`;
const  response  =  await  fetch(deleteUrl, {
method:  'DELETE',
headers: {
'Content-Type':  'application/json',
'x-apikey':  API_KEY
}
});
```
The above code cross references the given ListingID across the collection and deletes the corresponding entry in the collection.

## Usage Of Cloudinary (File Hosting Service)
**Contributor/Author**:Tan Si Ming Scott

### Why Cloudinary over RestDB
We chose to use Cloudinary to store our images due to the increased size of storage it can hold compared to the database, and it allows us to access and display images faster instead of having to send more requests to the database.

**Setting Up Cloudinary**
The prerequisites for cloudinary usage are, an active cloudinary account and an upload preset
```javascript
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/YOUR_ACCOUNT_NAME/upload';
const CLOUDINARY_UPLOAD_PRESET = 'UPLOAD_PRESET';
```
Above are examples of cloudinary upload URL and upload preset

---
### Cloudinary Data Manipulation

**1. Uploading to Cloudinary**

Cloudinary, similar to **RestDB** uses the  **POST** method to upload data into the cloud servers.
For example:
```javascript
async function uploadImageToCloudinary(file) {
const formData = new  FormData();
formData.append('file', file);
formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
const  response  =  await  fetch(CLOUDINARY_UPLOAD_URL, {
method:  'POST',
body:  formData
});
}
```
The above example builds a formdata object that includes the file and an upload preset, then sends this data in a **POST** request using the fetch API to Cloudinary.

**2. Displaying images uploaded in Cloudinary through links**

Now that the image is in Cloudinary's Servers, we can very simply just display the image with a single line of code.
```javascript
<img src="CLOUDINARY LINK" alt = "image" class = "cloudinary-image">
```
with a little formatting we can display it onto the html page.

## Listing Creation Form Backend(sellScript.js)

**Contributor/Author**:Tan Si Ming Scott

For the creation of an entry into our database, the **POST** Method is mainly used. Cloudinary was also used for image uploading.

 **Full Function**
 ```javascript
 async function handleListingSubmit(event) {
event.preventDefault(); // Prevents the default form submission behavior
// Prevent submitting again if already submitting
if(isSubmitting)return;
// Mark the form as submitting
isSubmitting = true;
// Disable the submit button to prevent multiple submissions
elements.submitButton.disabled  =  true;
const meetupCheckbox = document.getElementById("meetup");
const  deliveryCheckbox  =  document.getElementById("delivery");
const  dealLocationInput  =  document.getElementById("dealLocation");
// Only include dealLocation if meetup is selected
const  dealLocation  =  meetupCheckbox.checked  ?  dealLocationInput.value  :  "NA";
const  delivery  =  deliveryCheckbox.checked  ?  true  :  false;
const  formData  = {
title: elements.title.value,
description: elements.description.value,
price: elements.price.value,
category: elements.categoryInput.value,
condition: elements.conditionInput.value,
dealLocation: dealLocation,
delivery: delivery,
sellerID: JSON.parse(localStorage.getItem("user")).id,
sellerName: JSON.parse(localStorage.getItem("user")).name
};
const validationErrors = validateForm(formData);
if (validationErrors.length > 0){
alert(validationErrors.join('\n'));
// Re-enable the submit button if validation fails
elements.submitButton.disabled  =  false;
isSubmitting  =  false; // Mark as not submitting anymore
return;
} 
try {
// Upload images to Cloudinary before submitting
const  imageUrls  =  await  uploadImagesToCloudinary(state.uploadedImages);
if (!imageUrls.length) throw  new  Error("Failed to upload images");
// Rearrange images so the cover image comes first
const  orderedImages  = [imageUrls[state.coverImageIndex], ...imageUrls.filter((_, i) =>  i !== state.coverImageIndex)];
const imageString  =  orderedImages.join(",");
// Send the listing data including the image URLs
const response  =  await  fetch(RESTDB_LISTINGS_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-apikey': API_KEY
},
body:  JSON.stringify({
...formData,
coverImage:  orderedImages[0],
images:  imageString  // Comma-separated image URLs
})
});
if (!response.ok) {
throw  new  Error(`Failed to create listing: ${response.status}  ${response.statusText}`);
}
const result = await  response.json();
alert("Listing created successfully!");
resetForm();
} catch (error) {
console.error("Error:", error);
alert("An error occurred: "  +  error.message);
} finally {
// Re-enable the submit button after the request is complete
elements.submitButton.disabled  =  false;
isSubmitting  =  false; // Mark as not submitting anymore
}
}
```
### Form Submission Process

The function `handleListingSubmit(event)` is responsible for handling the submission of a new product listing. It ensures proper validation, prevents duplicate submissions, uploads images to Cloudinary, and finally sends the listing data to the database.

1.  **Prevents multiple submissions**:
    
    -   A flag (`isSubmitting`) ensures that users do not accidentally submit the form multiple times.
    -   The submit button is disabled while processing the request.
2.  **Handles meetup and delivery options**:
    
    -   If "Meetup" is selected, `dealLocation` is included; otherwise, it's marked as `"NA"`.
    -   If "Delivery" is checked, it's set as `true`.
3.  **Validates form data**:
    
    -   If validation fails, an alert is shown, and submission is stopped.
4.  **Uploads images to Cloudinary**:
    
    -   Images are uploaded before submitting the listing.
    -   The cover image is placed first in the order.
5.  **Sends listing data to the database**:
    
    -   Uses the **POST** method to send the listing details to the database along with image URLs.


