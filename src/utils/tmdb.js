// Import the dotenv package to read environment variables from .env file
import dotenv from 'dotenv';

// Import axios package to make HTTP requests to APIs
import axios from 'axios';

// Call dotenv.config() to load variables from .env into process.env
// This makes process.env.API_KEY available throughout this file
dotenv.config();

// Store the API key from .env file in a constant
// This keeps our secret key hidden from the code
const API_KEY = process.env.API_KEY;

// Store the TMDB API base URL in a constant
// If TMDB changes their URL, we only need to update it here
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to search for movies by title
// 'export' makes this function available to other files
// 'async' means this function does asynchronous work (waits for API response)
// 'query' is the parameter - the movie title the user searches for
export const searchMovies = async (query) => {
    // try/catch handles errors gracefully
    // If something goes wrong, we catch it and show a friendly message
    try {
        // Build the complete URL for the API request
        // ${BASE_URL} inserts "https://api.themoviedb.org/3"
        // /search/movie is the endpoint to search for movies
        // ?api_key=${API_KEY} adds our authentication key
        // &query=${...} adds the search term
        // encodeURIComponent converts spaces and special characters to be URL-safe
        // Example result: https://api.themoviedb.org/3/search/movie?api_key=abc123&query=Inception
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        
        // Make the HTTP GET request to TMDB API
        // axios.get(url) sends the request
        // await pauses execution until the response comes back
        // response stores the data that comes back from TMDB
        const response = await axios.get(url);
        
        // Return only the results array from the response
        // response.data is the full response object
        // response.data.results is the array of movies
        return response.data.results;
        
    } catch (error) {
        // If anything goes wrong (bad internet, API error, etc.)
        // throw a user-friendly error message
        throw new Error('Unable to search for movies');
    }
};

// Function to get movies similar to a specific movie
// Takes a movieId (number like 550) instead of a search term
export const getSimilarMovies = async (movieId) => {
    try {
        // Build URL for similar movies endpoint
        // Example: https://api.themoviedb.org/3/movie/550/similar?api_key=abc123
        const url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`;
        
        // Make the request and wait for response
        const response = await axios.get(url);
        
        // Return the array of similar movies
        return response.data.results;
        
    } catch (error) {
        // Handle errors with friendly message
        throw new Error('Unable to get similar movies');
    }
};