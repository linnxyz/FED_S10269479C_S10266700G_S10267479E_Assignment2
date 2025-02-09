# **MokeSell**
![enter image description here](https://res.cloudinary.com/dtpvsevc7/image/upload/v1739095071/nyygwffiqbrlyyuc0kd4.png)

**MokeSell** is a web-based marketplace platform that allows users to buy and sell products online. The platform provides a structured way for users to list items, browse available products, and find great deals with ease.

This repository contains the source code for MokeSell, including the frontend and backend implementation. It is designed to demonstrate web development concepts such as **APIs, database implementations , and responsive UI design**.

🎨 This project is built using:

-   **HTML, CSS, JavaScript** for the frontend
-   **RestDB** for database

This documentation explains the functionality,  structure and the technology used in the project. 

---

### 📝 Project Breakdown & Implementation

**Contributor/Author**: Linn Thit Aung

### 1. Main Page (index.html)

The **index page** serves as the main landing page for the Mokesell website. This page is crucial because it offers the first impression of the website and acts as a central hub for users to explore various products.
We use **RestDB** as our database to store all our data because it is flexible and easy to use.

### Extracting Data from RestDB

**RESTdb** allows for easy management and retrieval of product details like name, description, price, and images, all of which are displayed on the index page for the users to explore. Here’s how our data extraction works:

#### 1. **Setting Up RestDB  API**

RestDB provides an API endpoint that allows us to interact with our database and retrieve data using simple HTTP requests (e.g., GET requests). In this project, we set up RestDB to store all the product data, including the product name, price, description, and image URLs. The API endpoint URL is configured to point to the specific collection of product data in the database.

For example, our endpoint look something like this:
```
https://mokesell-database-name.restdb.io/rest/listings

```

Here, `listings` is the name of the collection containing all the product data.

#### 2. **Fetching Data from RestDB Using JavaScript**

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


#### 3. **Displaying Product Cards on the Index Page**

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

#### 4. **Error Handling**

When interacting with external APIs, it’s important to handle potential errors, such as network failures or invalid responses from the server. In the `fetch()` request, we included a `.catch()` block to log any errors that might occur during the request process.

Additionally, it’s good practice to provide the user with feedback if the products cannot be loaded. This can be done by displaying an error message on the page in case the `fetch()` request fails.

Our example usage:

```javascript
} catch (error) {
	console.error('Error fetching products:',  error);
	document.getElementById('products').innerHTML  =
	'<p>Error loading products. Please try again later.</p>';
}
```
