document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchDropdown = document.getElementById("search-dropdown");
    const searchResults = document.getElementById("search-results");

    // Sample data for featured articles
    const featuredArticles = [
        { title: "How do I contact the Support Team?", link: "#" },
        { title: "Can I have more than one MokeSell account?", link: "#" },
        { title: "What is Listing Quota", link: "#" },
        { title: "[Hong Kong] Category-based quota for all categories", link: "#" },
        { title: "[Singapore] My order is cancelled, how do I get my money back?", link: "#" },
        { title: "[Malaysia] My order is cancelled, how do I get my money back?", link: "#" },
    ];

    // Function to filter articles based on search input
    function filterArticles(query) {
        return featuredArticles.filter(article =>
            article.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Function to display filtered results
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

    // Show dropdown and filter results when typing
    searchInput.addEventListener("input", function () {
        const query = this.value.trim();
        if (query !== "") {
            const filteredResults = filterArticles(query);
            displayResults(filteredResults);
            searchDropdown.style.display = "block";
        } else {
            searchDropdown.style.display = "none";
        }
    });

    // Show dropdown when clicking on the search input
    searchInput.addEventListener("focus", function () {
        if (this.value.trim() !== "") {
            searchDropdown.style.display = "block";
        }
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













