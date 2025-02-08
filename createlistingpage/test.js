const LISTINGS_CONTAINER = document.getElementById("listingsContainer");
const RESTDB_LISTINGS_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings';
const API_KEY = '677f31d996bc7400895f1141';

async function fetchAndDisplayListing() {
    const listingID = document.getElementById("listingIdInput").value.trim();

    if (!listingID) {
        alert("Please enter a valid listing ID.");
        return;
    }

    try {
        // Query RestDB for the listing by listingID
        const queryUrl = `${RESTDB_LISTINGS_URL}?q=${encodeURIComponent(JSON.stringify({ listingID: parseInt(listingID) }))}`;
        const queryResponse = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            }
        });

        if (!queryResponse.ok) {
            throw new Error(`Failed to query listing: ${queryResponse.status} ${queryResponse.statusText}`);
        }

        const queryResult = await queryResponse.json();
        if (queryResult.length === 0) {
            alert("No listing found with the specified ID.");
            return;
        }

        const listing = queryResult[0]; // Get the first result

        displayListing(listing);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching the listing: " + error.message);
    }
}

function displayListing(listing) {
    LISTINGS_CONTAINER.innerHTML = ""; // Clear previous content

    const listingElement = document.createElement("div");
    listingElement.classList.add("listing");

    listingElement.innerHTML = `
        <h3>${listing.title}</h3>
        <p>${listing.description}</p>
        <p><strong>Price:</strong> $${listing.price}</p>
        <p><strong>Category:</strong> ${listing.category}</p>
        <p><strong>Condition:</strong> ${listing.condition}</p>
        <img src="${listing.image}" alt="Listing Image" class="listing-image">
    `;

    LISTINGS_CONTAINER.appendChild(listingElement);
}
