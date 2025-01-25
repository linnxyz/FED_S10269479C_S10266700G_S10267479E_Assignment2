const RESTDB_LISTINGS_URL = 'https://mokesellcustomers-cfe3.restdb.io/rest/listings';
const API_KEY = '677f31d996bc7400895f1141';

async function handleListingSubmit(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const condition = document.getElementById('condition').value;

    try {
        const response = await fetch(RESTDB_LISTINGS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            },
            body: JSON.stringify({
                title,
                description,
                category,
                price,
                condition
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create listing: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        alert("Listing created successfully: " + JSON.stringify(result));
        document.getElementById('listingForm').reset();
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    }
}
async function handledeletereqSubmit(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const ListingID = document.getElementById('ListingID').value.trim(); // Get and trim the ID from the input field

    if (!ListingID) {
        alert("Please provide a valid Listing ID.");
        return;
    }

    try {
        // Construct the DELETE URL with query syntax
        const deleteUrl = `${RESTDB_LISTINGS_URL}?q={"listingID":"${ListingID}"}`;

        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete listing: ${response.status} ${response.statusText}`);
        }

        alert("Listing deleted successfully.");
        document.getElementById('listingdeleteForm').reset(); // Clear the form
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting the listing: " + error.message);
    }
}
async function handleModifySubmit(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const listingID = document.getElementById('ListingID').value.trim(); // Get the Listing ID
    const title = document.getElementById('newTitle').value.trim(); // Get new title
    const description = document.getElementById('newDescription').value.trim(); // Get new description
    const price = document.getElementById('newPrice').value.trim(); // Get new price
    const category = document.getElementById('newCategory').value.trim(); // Get new category
    const condition = document.getElementById('newCondition').value.trim(); // Get new condition

    if (!listingID) {
        alert("Please provide a valid Listing ID.");
        return;
    }

    try {
        // Step 1: Query to find the record by listingID
        const queryUrl = `${RESTDB_LISTINGS_URL}?q={"listingID":"${listingID}"}`;
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            }
        });

        const data = await response.json();
        if (data.length === 0) {
            alert("No listing found with the provided Listing ID.");
            return;
        }

        // Step 2: Use the unique `_id` from the queried record
        const recordId = data[0]._id;

        // Step 3: Update the record using the `_id`
        const modifyUrl = `${RESTDB_LISTINGS_URL}/${recordId}`;
        const modifyResponse = await fetch(modifyUrl, {
            method: 'PATCH', // Use PATCH to partially update the record
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            },
            body: JSON.stringify({
                title,
                description,
                price,
                category,
                condition
            })
        });

        if (!modifyResponse.ok) {
            throw new Error(`Failed to modify listing: ${modifyResponse.status} ${modifyResponse.statusText}`);
        }

        const result = await modifyResponse.json();
        alert("Listing modified successfully: " + JSON.stringify(result));
        document.getElementById('listingForm').reset(); // Clear the form
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while modifying the listing: " + error.message);
    }
}