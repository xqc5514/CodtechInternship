document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'pub_7d802f23072a4781b0d859c136b3e1f7'; // Your provided API key
    const newsContainer = document.getElementById('news-container'); //
    const searchInput = document.getElementById('search-input'); //
    const searchButton = document.getElementById('search-button'); //

    let currentQuery = 'India'; // Default search query
    let currentPage = 1; // Initial page number
    const pageSize = 10; // Number of articles per page

    async function fetchNews(query, page = 1) { // Function to fetch news
        let NEWS_API_URL; // Declare NEWS_API_URL

        // Construct the API URL using the provided API key
        NEWS_API_URL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;

        try {
            newsContainer.innerHTML = '<p>Loading news...</p>'; // Show loading message

            const response = await fetch(NEWS_API_URL); // Fetch data from the API
            if (!response.ok) { // Check if the response is not OK
                const errorData = await response.json(); // Parse error data
                throw new Error(`HTTP error! Status: ${response.status}. Code: ${errorData.code || 'N/A'}. Message: ${errorData.message || 'Unknown error.'}`); // Throw an error
            }
            const data = await response.json(); // Parse the JSON data

            if (data.articles && data.articles.length === 0) { // Check if no articles are found
                newsContainer.innerHTML = `<p>No news found for "${query}" at the moment. Please try a different search term or check your API key/rate limits.</p>`; // Display no news message
                return; // Exit the function
            }

            displayNews(data.articles); // Display the fetched articles

        } catch (error) {
            console.error('Error fetching news:', error); // Log the error
            newsContainer.innerHTML = `<p>Failed to load news: ${error.message}. Please check your API key, internet connection, or try again later.</p>`; // Display error message
        }
    }

    function displayNews(articles) { // Function to display news articles
        newsContainer.innerHTML = ''; // Clear previous news
            if (!articles || articles.length === 0) { // Check if articles are empty
            newsContainer.innerHTML = '<p>No articles to display.</p>'; // Display no articles message
            return; // Exit the function
        }

        articles.forEach(article => { // Iterate over each article
            if (article.title && article.url && article.urlToImage) { // Check for essential article properties
                const newsArticleDiv = document.createElement('div'); // Create a new div for the article
                newsArticleDiv.classList.add('news-article'); // Add a class to the div

                const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image+Available'; // Use placeholder if no image
                const description = article.description || 'Click to read more.'; // Use default description if none provided

                newsArticleDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${article.title}">
                    <div class="article-content">
                        <h2>${article.title}</h2>
                        <p>${description}</p>
                        <a href="${article.url}" target="_blank">Read More</a>
                    </div>
                `; // Set the inner HTML for the article
                newsContainer.appendChild(newsArticleDiv); // Append the article to the container
            }
        });
    }

    searchButton.addEventListener('click', () => { // Add event listener to the search button
        const query = searchInput.value.trim(); // Get the search query
        if (query) { // If query is not empty
            currentQuery = query; // Set current query
            currentPage = 1; // Reset page to 1
            fetchNews(currentQuery, currentPage); // Fetch news with the new query
        } else {
           
            currentQuery = 'India'; // Set default query to India
            fetchNews(currentQuery, currentPage); // Fetch news with default query
        }
    });

    fetchNews(currentQuery, currentPage); // Initial news fetch when the page loads
});
