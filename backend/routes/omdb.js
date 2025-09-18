const express = require('express');
const omdbService = require('../services/omdbService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/omdb/movies/popular
// @desc    Get popular movies from OMDb
// @access  Public
router.get('/movies/popular', async (req, res) => {
  try {
    const data = await omdbService.getPopularMovies();
    res.json(data);
  } catch (error) {
    console.error('Get popular movies error:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
});

// @route   GET /api/omdb/movies/top-rated
// @desc    Get top rated movies from OMDb
// @access  Public
router.get('/movies/top-rated', async (req, res) => {
  try {
    const data = await omdbService.getTopRatedMovies();
    res.json(data);
  } catch (error) {
    console.error('Get top rated movies error:', error);
    res.status(500).json({ message: 'Failed to fetch top rated movies' });
  }
});

// @route   GET /api/omdb/movies/trending
// @desc    Get trending movies (same as popular for OMDb)
// @access  Public
router.get('/movies/trending', async (req, res) => {
  try {
    const data = await omdbService.getPopularMovies();
    res.json(data);
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
});

// @route   GET /api/omdb/movies/now-playing
// @desc    Get now playing movies (same as popular for OMDb)
// @access  Public
router.get('/movies/now-playing', async (req, res) => {
  try {
    const data = await omdbService.getPopularMovies();
    res.json(data);
  } catch (error) {
    console.error('Get now playing movies error:', error);
    res.status(500).json({ message: 'Failed to fetch now playing movies' });
  }
});

// @route   GET /api/omdb/movies/upcoming
// @desc    Get upcoming movies (same as popular for OMDb)
// @access  Public
router.get('/movies/upcoming', async (req, res) => {
  try {
    const data = await omdbService.getPopularMovies();
    res.json(data);
  } catch (error) {
    console.error('Get upcoming movies error:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming movies' });
  }
});

// @route   GET /api/omdb/movies/search
// @desc    Search movies from OMDb
// @access  Public
router.get('/movies/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const data = await omdbService.searchMovies(query, parseInt(page));
    
    const movies = data.movies.map(movie => omdbService.transformSearchResult(movie));
    
    res.json({
      movies,
      query,
      pagination: {
        currentPage: data.page,
        totalPages: data.totalPages,
        totalMovies: data.totalResults,
        hasNext: data.page < data.totalPages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// @route   GET /api/omdb/movies/genre/:genre
// @desc    Get movies by genre from OMDb
// @access  Public
router.get('/movies/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = parseInt(req.query.limit) || 12;
    
    const data = await omdbService.getMoviesByGenre(genre, limit);
    
    res.json({
      ...data,
      genre
    });
  } catch (error) {
    console.error('Get movies by genre error:', error);
    res.status(500).json({ message: 'Failed to fetch movies by genre' });
  }
});

// @route   GET /api/omdb/movies/:imdbId
// @desc    Get movie details from OMDb
// @access  Public
router.get('/movies/:imdbId', async (req, res) => {
  try {
    const { imdbId } = req.params;
    
    const data = await omdbService.getMovieDetails(imdbId);
    const movie = omdbService.transformMovieData(data);
    
    res.json({ movie });
  } catch (error) {
    console.error('Get movie details error:', error);
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

// @route   GET /api/omdb/movies/title/:title
// @desc    Get movie by title from OMDb
// @access  Public
router.get('/movies/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    
    const movie = await omdbService.getMovieByTitle(decodeURIComponent(title));
    
    res.json({ movie });
  } catch (error) {
    console.error('Get movie by title error:', error);
    res.status(500).json({ message: 'Failed to fetch movie by title' });
  }
});

// @route   GET /api/omdb/genres
// @desc    Get available genres (hardcoded list)
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    const genres = [
      { id: 'Action', name: 'Action' },
      { id: 'Comedy', name: 'Comedy' },
      { id: 'Drama', name: 'Drama' },
      { id: 'Horror', name: 'Horror' },
      { id: 'Sci-Fi', name: 'Sci-Fi' },
      { id: 'Romance', name: 'Romance' },
      { id: 'Thriller', name: 'Thriller' },
      { id: 'Crime', name: 'Crime' },
      { id: 'Fantasy', name: 'Fantasy' },
      { id: 'Animation', name: 'Animation' },
      { id: 'Adventure', name: 'Adventure' },
      { id: 'Mystery', name: 'Mystery' },
      { id: 'Family', name: 'Family' },
      { id: 'Documentary', name: 'Documentary' },
      { id: 'War', name: 'War' },
      { id: 'Western', name: 'Western' },
      { id: 'Musical', name: 'Musical' },
      { id: 'Biography', name: 'Biography' },
      { id: 'History', name: 'History' },
      { id: 'Sport', name: 'Sport' }
    ];
    
    res.json({ genres });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});

module.exports = router;
