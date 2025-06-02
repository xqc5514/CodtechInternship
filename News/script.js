document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'pub_7d802f23072a4781b0d859c136b3e1f7'; 
    const newsContainer = document.getElementById('news-container'); 
    const searchInput = document.getElementById('search-input'); 
    const searchButton = document.getElementById('search-button'); 

    let currentQuery = 'India'; 
    let currentPage = 1; 
    const pageSize = 10; 

    async function fetchNews(query, page = 1) { 
        let NEWS_API_URL; 

        
        NEWS_API_URL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;

        try {
            newsContainer.innerHTML = '<p>Loading news...</p>'; 

            const response = await fetch(NEWS_API_URL); 
            if (!response.ok) {
                const errorData = await response.json(); 
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
