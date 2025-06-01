document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '9b6b9a27ad8940099aa308eb31107465'; // Your API Key
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Default search query
    let currentQuery = 'India'; // Start with a broader query relevant to your location
    let currentPage = 1;
    const pageSize = 10; // Number of articles per page

    async function fetchNews(query, page = 1) {
        let NEWS_API_URL;

        // Use the 'everything' endpoint for general searches
        NEWS_API_URL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
        
        // If you specifically wanted top headlines for a country, uncomment and use this:
        // NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=in&category=general&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
        // In this case, 'q' won't work in combination with 'country'.

        try {
            newsContainer.innerHTML = '<p>Loading news...</p>'; // Display loading message

            const response = await fetch(NEWS_API_URL);
            if (!response.ok) {
                // If the response is not OK (e.g., 404, 500, or API key issues)
                const errorData = await response.json(); // Try to read the error message from the API
                throw new Error(`HTTP error! Status: ${response.status}. Code: ${errorData.code || 'N/A'}. Message: ${errorData.message || 'Unknown error.'}`);
            }
            const data = await response.json();

            if (data.articles && data.articles.length === 0) {
                newsContainer.innerHTML = `<p>No news found for "${query}" at the moment. Please try a different search term or check your API key/rate limits.</p>`;
                return;
            }

            displayNews(data.articles);

        } catch (error) {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = `<p>Failed to load news: ${error.message}. Please check your API key, internet connection, or try again later.</p>`;
        }
    }

    function displayNews(articles) {
        newsContainer.innerHTML = ''; // Clear previous content

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p>No articles to display.</p>';
            return;
        }

        articles.forEach(article => {
            // Check if essential article properties exist before creating the card
            // We are being more flexible here; if description is missing, we'll provide a default.
            if (article.title && article.url && article.urlToImage) {
                const newsArticleDiv = document.createElement('div');
                newsArticleDiv.classList.add('news-article');

                const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image+Available'; // Fallback image
                const description = article.description || 'Click to read more.'; // Fallback description

                newsArticleDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${article.title}">
                    <div class="article-content">
                        <h2>${article.title}</h2>
                        <p>${description}</p>
                        <a href="${article.url}" target="_blank">Read More</a>
                    </div>
                `;
                newsContainer.appendChild(newsArticleDiv);
            }
        });
    }

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            currentQuery = query;
            currentPage = 1; // Reset to first page for new search
            fetchNews(currentQuery, currentPage);
        } else {
            // If search input is empty, revert to default query or show a message
            currentQuery = 'India'; // Or keep it empty and show a message
            fetchNews(currentQuery, currentPage);
        }
    });

    // Initial fetch when the page loads
    fetchNews(currentQuery, currentPage);
});