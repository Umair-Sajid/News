const apikey = '46a383a45d4942cda845f14583bf30f8';
const blogContainer = document.getElementById('blog-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

let allArticles = []; // Store all articles for filtering

async function fetchRandomNews() {
    try {
        // Use the correct endpoint and ensure it matches API documentation
        const apiUrl = `https://newsapi.org/v2/everything?domains=wsj.com&pageSize=20&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        
        // Check if the response is OK
        if (!response.ok) {
            // Log error response details
            const errorMessage = `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        allArticles = data.articles || []; // Ensure allArticles is always an array
        return allArticles;
    } catch (error) {
        console.error("Error fetching news", error);
        blogContainer.innerHTML = `<p class="text-danger">Failed to fetch news. Please try again later.</p>`;
        return [];
    }
}

function displayBlog(articles = []) { // Default to empty array if undefined
    blogContainer.innerHTML = ''; // Clear any existing content

    if (articles.length === 0) {
        blogContainer.innerHTML = '<p class="text-danger">No news articles found for your search.</p>';
    } else {
        articles.forEach(article => {
            const blogCard = document.createElement("div");
            blogCard.classList.add("col", "mb-4"); // Added bottom margin for spacing

            // Create image element
            const img = document.createElement("img");
            img.src = article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/70';
            img.classList.add("card-img-top");

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const title = document.createElement("h5");
            title.textContent = article.title;
            title.classList.add("card-title");

            const description = document.createElement("p");
            description.textContent = article.description;
            description.classList.add("card-text");

            // Create "Read More" button
            const readMoreButton = document.createElement("a");
            readMoreButton.href = article.url; // Link to the full article
            readMoreButton.target = "_blank"; // Open in a new tab
            readMoreButton.classList.add("btn", "btn-warning", "btnread"); // Bootstrap button classes
            readMoreButton.textContent = "Read More";

            // Append elements to card body
            cardBody.appendChild(title);
            cardBody.appendChild(description);
            cardBody.appendChild(readMoreButton); // Append the "Read More" button

            // Create card element and append everything
            const card = document.createElement("div");
            card.classList.add("card", "h-100"); // Ensures the card takes full height
            card.appendChild(img);
            card.appendChild(cardBody);

            // Append the card to the blog card div
            blogCard.appendChild(card);

            // Append the blog card to the container
            blogContainer.appendChild(blogCard);
        });
    }
}

function filterArticles(query) {
    if (!query) {
        displayBlog(allArticles);
        return;
    }

    const filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
    );

    displayBlog(filteredArticles);
}

// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', event => {
            event.preventDefault(); // Prevent form from submitting the traditional way
            const query = searchInput.value.trim();
            filterArticles(query);
        });
    } else {
        console.error("Search form or search input not found.");
    }

    (async () => {
        try {
            await fetchRandomNews();
            displayBlog(allArticles); // Display all articles initially
        } catch (error) {
            console.error("Error fetching and displaying news", error);
        }
    })();
});
