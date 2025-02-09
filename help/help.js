document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchDropdown = document.getElementById("search-dropdown");
    const searchResults = document.getElementById("search-results");

    // Sample data for featured articles
    const featuredArticles = [
        { title: "How do I contact the Support Team?", link: "../News/Supportteam.html" },
        { title: "Can I have more than one MokeSell account?", link: "#" },
        { title: "What is Listing Quota", link: "#" },
        { title: "[Hong Kong] Category-based quota for all categories", link: "#" },
        { title: "[Singapore] My order is cancelled, how do I get my money back?", link: "#" },
        { title: "[Malaysia] My order is cancelled, how do I get my money back?", link: "#" },
    ];

    // Function to display results
    function displayResults(results) {
        searchResults.innerHTML = ""; // Clear previous results
        if (results.length > 0) {
            results.forEach(result => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = result.link;
                a.textContent = result.title;
                li.appendChild(a);
                searchResults.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No results found.";
            searchResults.appendChild(li);
        }
    }

    // Function to filter articles based on search input
    function filterArticles(query) {
        if (query.trim() === "") {
            return featuredArticles; // If empty, show all articles
        }
        return featuredArticles.filter(article =>
            article.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Show dropdown and display all articles when clicking on the search input
    searchInput.addEventListener("focus", function () {
        searchDropdown.style.display = "block";
        displayResults(featuredArticles); // Show all articles initially
    });

    // Filter results as user types
    searchInput.addEventListener("input", function () {
        const query = this.value.trim();
        const filteredResults = filterArticles(query);
        displayResults(filteredResults);
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
            searchDropdown.style.display = "none";
        }
    });

    // Prevent dropdown from closing when clicking inside
    searchDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});
