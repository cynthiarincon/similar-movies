// Get the form and input
const form = document.getElementById('searchForm');
const input = document.getElementById('movieInput');
const results = document.getElementById('results');

// When user submits form
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page from reloading
    
    const movieTitle = input.value; // Get what user typed
    
    // Show loading message
    results.innerHTML = '<p>Loading...</p>';
    
    // Ask server for movies
    fetch('/api/search?title=' + movieTitle)
        .then(response => response.json()) // Get JSON data
        .then(data => {
            // Clear results
            results.innerHTML = '';
            
            // Show each movie
            data.movies.forEach(movie => {
                // Create a div for the movie
                const card = document.createElement('div');
                card.className = 'movie-card';
                
                // Get the year
                const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
                
                // Get poster image URL
                const posterUrl = movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Poster';
                
                // Put movie info in the card with poster
                card.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">
                    <div class="movie-details">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-info">Year: ${year} | Rating: ${movie.vote_average}</div>
                    </div>
                `;
                
                // When user clicks, get similar movies
                card.addEventListener('click', function() {
                    getSimilarMovies(movie.id, movie.title);
                });
                
                // Add card to page
                results.appendChild(card);
            });
        });
});

// Function to get similar movies
function getSimilarMovies(movieId, movieTitle) {
    // Show loading
    results.innerHTML = '<p>Finding similar movies...</p>';
    
    // Ask server for similar movies
    fetch('/api/similar?movieId=' + movieId)
        .then(response => response.json())
        .then(data => {
            // Clear results
            results.innerHTML = '<h2>Similar to: ' + movieTitle + '</h2>';
            
            // Show each similar movie
            data.similar.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                
                const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
                
                // Get poster image URL
                const posterUrl = movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Poster';
                
                card.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">
                    <div class="movie-details">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-info">Year: ${year} | Rating: ${movie.vote_average}</div>
                    </div>
                `;
                
                results.appendChild(card);
            });
        });
}