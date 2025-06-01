document.addEventListener('DOMContentLoaded', () => {
    // REMOVE THE API_KEY HERE. IT'S NO LONGER NEEDED ON THE FRONTEND.
    // const API_KEY = 'YOUR_API_KEY_HERE';

    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    let currentQuery = 'India';
    let currentPage = 1;
    const pageSize = 10;

    async function fetchNews(query, page = 1) {
        // Now, we call OUR serverless function, which will then call NewsAPI
        const SERVERLESS_API_URL = `/api/get-news?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;

        try {
            newsContainer.innerHTML = '<p>Loading news...</p>';

            const response = await fetch(SERVERLESS_API_URL);
            if (!response.ok) {
                const errorData = await response.json();
                // Display the error message coming from our serverless function
                throw new Error(errorData.message || errorData.error || `HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.articles && data.articles.length === 0) {
                newsContainer.innerHTML = `<p>No news found for "${query}" at the moment. Please try a different search term.</p>`;
                return;
            }

            displayNews(data.articles);

        } catch (error) {
            console.error('Error fetching news from serverless function:', error);
            newsContainer.innerHTML = `<p>Failed to load news: ${error.message}. Please try again later.</p>`;
        }
    }

    function displayNews(articles) {
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p>No articles to display.</p>';
            return;
        }

        articles.forEach(article => {
            if (article.title && article.url && article.urlToImage) {
                const newsArticleDiv = document.createElement('div');
                newsArticleDiv.classList.add('news-article');

                const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image+Available';
                const description = article.description || 'Click to read more.';

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

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            currentQuery = query;
            currentPage = 1;
            fetchNews(currentQuery, currentPage);
        } else {
            currentQuery = 'India';
            fetchNews(currentQuery, currentPage);
        }
    });

    fetchNews(currentQuery, currentPage);
});

script.js
