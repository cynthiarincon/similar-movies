// Get the form and input
const form = document.getElementById('searchForm');
const input = document.getElementById('movieInput');
const results = document.getElementById('results');
const welcomeSection = document.querySelector('.welcome-section');

// When user submits form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const movieTitle = input.value.trim();
    if (!movieTitle) return;
    
    // Hide welcome section after first search
    if (welcomeSection) {
        welcomeSection.style.display = 'none';
    }
    
    results.innerHTML = '<p class="loading">Loading...</p>';
    
    fetch('/api/search?title=' + encodeURIComponent(movieTitle))
        .then(response => response.json())
        .then(data => {
            results.innerHTML = '';
            
            if (data.error || data.movies.length === 0) {
                results.innerHTML = '<p class="error">No movies found!</p>';
                return;
            }
            
            data.movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                
                const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
                const posterUrl = movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Poster';
                
                card.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">
                    <div class="movie-details">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-info">Year: ${year} | Rating: ${movie.vote_average}</div>
                    </div>
                `;
                
                card.addEventListener('click', function() {
                    getSimilarMovies(movie.id, movie.title, movie.overview);
                });
                
                results.appendChild(card);
            });
        })
        .catch(() => {
            results.innerHTML = '<p class="error">Something went wrong!</p>';
        });
});

// Function to get similar movies
function getSimilarMovies(movieId, movieTitle, overview) {
    results.innerHTML = '<p class="loading">Finding similar movies...</p>';
    
    fetch('/api/similar?movieId=' + movieId)
        .then(response => response.json())
        .then(data => {
            results.innerHTML = `
                <div class="selected-movie">
                    <h2>Selected: ${movieTitle}</h2>
                    <p class="movie-description">${overview || 'No description available.'}</p>
                </div>
                <h2>Similar Movies</h2>
            `;
            
            if (data.error || data.similar.length === 0) {
                results.innerHTML += '<p class="error">No similar movies found!</p>';
                return;
            }
            
            data.similar.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                
                const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
                const posterUrl = movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Poster';
                
                card.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">
                    <div class="movie-details">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-info">Year: ${year} | Rating: ${movie.vote_average}</div>
                    </div>
                `;
                
                results.appendChild(card);
            });
        })
        .catch(() => {
            results.innerHTML = '<p class="error">Something went wrong!</p>';
        });
}