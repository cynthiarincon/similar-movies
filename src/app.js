// Import dotenv to read environment variables from .env file
import dotenv from 'dotenv';

// Import express - a framework that makes building web servers easy
import express from 'express';

// Import path - helps work with file and folder paths
import path from 'path';

// Import fileURLToPath and dirname helpers
// ES modules don't have __dirname like CommonJS, so we create it manually
import { fileURLToPath } from 'url';

// Import our custom functions from tmdb.js
// These are the functions we just wrote to search movies and get similar movies
import { searchMovies, getSimilarMovies } from './utils/tmdb.js';

// Run dotenv.config() to load variables from .env into process.env
dotenv.config();

// ES modules don't have __dirname (current directory path) built-in
// So we manually create it using fileURLToPath and import.meta.url
// __filename = the full path to THIS file (app.js)
const __filename = fileURLToPath(import.meta.url);

// __dirname = the folder that contains THIS file (the 'src' folder)
const __dirname = path.dirname(__filename);

// Create an Express application
// Think of 'app' as your web server - it will listen for requests and send responses
const app = express();

// Set the port number
// process.env.PORT is for deployment (like Heroku, AWS)
// If PORT doesn't exist in .env, use 3000 as default
// The || means "OR" - use the first value that exists
const port = process.env.PORT || 3000;

// Tell Express where to find static files (HTML, CSS, JS, images)
// __dirname is the 'src' folder
// '../public' goes up one level and into the 'public' folder
// So publicPath = /Users/cynthia/.../similar-movies/public
const publicPath = path.join(__dirname, '../public');

// app.use(express.static(...)) tells Express:
// "Serve files from the public folder to the browser"
// When user visits http://localhost:3000, serve public/index.html
// When browser requests /css/styles.css, serve public/css/styles.css
app.use(express.static(publicPath));

// Create an API endpoint (route) for searching movies
// When frontend calls /api/search?title=Inception, this function runs
// 'async' because we'll use 'await' to call searchMovies()
app.get('/api/search', async (req, res) => {
    // req = request object (contains info about what the user asked for)
    // res = response object (used to send data back to the user)
    
    // req.query contains URL parameters
    // Example: /api/search?title=Inception
    // req.query = { title: "Inception" }
    
    // Check if the user provided a title parameter
    if (!req.query.title) {
        // If not, send back an error message
        // return stops the function here (don't continue)
        return res.send({ error: 'Please provide a movie title' });
    }

    // If we get here, user provided a title, so let's search for it
    try {
        // Call our searchMovies function from tmdb.js
        // Pass in the title the user searched for
        // await waits for the API call to TMDB to finish
        // movies will be an array of movie objects
        const movies = await searchMovies(req.query.title);
        
        // Send the movies back to the frontend as JSON
        // res.send() sends data back to whoever made the request
        // { movies } is shorthand for { movies: movies }
        res.send({ movies });
        
    } catch (error) {
        // If anything went wrong (TMDB API down, bad internet, etc.)
        // Send back an error message instead of crashing
        res.send({ error: error.message });
    }
});

// Create an API endpoint for getting similar movies
// When frontend calls /api/similar?movieId=550, this function runs
app.get('/api/similar', async (req, res) => {
    // Check if the user provided a movieId parameter
    if (!req.query.movieId) {
        return res.send({ error: 'Please provide a movie ID' });
    }

    try {
        // Call our getSimilarMovies function from tmdb.js
        // Pass in the movie ID the user clicked on
        const similar = await getSimilarMovies(req.query.movieId);
        
        // Send the similar movies back to the frontend
        res.send({ similar });
        
    } catch (error) {
        // Handle errors gracefully
        res.send({ error: error.message });
    }
});

// Start the server and make it listen for requests
// app.listen(port, callback) starts the server on the specified port
// The callback function runs once the server successfully starts
app.listen(port, () => {
    // This message prints in the TERMINAL (not the browser)
    // It confirms your server is running
    console.log(`Server is running on http://localhost:${port}`);
});