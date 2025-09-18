const express = require('express');
const tmdbService = require('../services/tmdbService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tmdb/movies/popular
// @desc    Get popular movies from TMDB
// @access  Public
router.get('/movies/popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getPopularMovies(page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get popular movies error:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
});

// @route   GET /api/tmdb/movies/top-rated
// @desc    Get top rated movies from TMDB
// @access  Public
router.get('/movies/top-rated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getTopRatedMovies(page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get top rated movies error:', error);
    res.status(500).json({ message: 'Failed to fetch top rated movies' });
  }
});

// @route   GET /api/tmdb/movies/trending
// @desc    Get trending movies from TMDB
// @access  Public
router.get('/movies/trending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const timeWindow = req.query.time_window || 'week';
    const data = await tmdbService.getTrendingMovies(timeWindow, page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
});

// @route   GET /api/tmdb/movies/now-playing
// @desc    Get now playing movies from TMDB
// @access  Public
router.get('/movies/now-playing', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getNowPlayingMovies(page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get now playing movies error:', error);
    res.status(500).json({ message: 'Failed to fetch now playing movies' });
  }
});

// @route   GET /api/tmdb/movies/upcoming
// @desc    Get upcoming movies from TMDB
// @access  Public
router.get('/movies/upcoming', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getUpcomingMovies(page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get upcoming movies error:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming movies' });
  }
});

// @route   GET /api/tmdb/movies/search
// @desc    Search movies from TMDB
// @access  Public
router.get('/movies/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const data = await tmdbService.searchMovies(query, parseInt(page));
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      query,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// @route   GET /api/tmdb/movies/genre/:genreId
// @desc    Get movies by genre from TMDB
// @access  Public
router.get('/movies/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const page = parseInt(req.query.page) || 1;
    
    const data = await tmdbService.getMoviesByGenre(genreId, page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      genreId,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get movies by genre error:', error);
    res.status(500).json({ message: 'Failed to fetch movies by genre' });
  }
});

// @route   GET /api/tmdb/movies/:movieId
// @desc    Get movie details from TMDB
// @access  Public
router.get('/movies/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const data = await tmdbService.getMovieDetails(movieId);
    const movie = tmdbService.transformMovieData(data);
    
    // Add additional details
    movie.director = data.credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A';
    movie.cast = data.credits?.cast?.slice(0, 10).map(actor => actor.name) || [];
    movie.trailer = await tmdbService.getMovieTrailer(movieId);
    
    res.json({ movie });
  } catch (error) {
    console.error('Get movie details error:', error);
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

// @route   GET /api/tmdb/movies/:movieId/recommendations
// @desc    Get movie recommendations from TMDB
// @access  Public
router.get('/movies/:movieId/recommendations', async (req, res) => {
  try {
    const { movieId } = req.params;
    const page = parseInt(req.query.page) || 1;
    
    const data = await tmdbService.getRecommendedMovies(movieId, page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get movie recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch movie recommendations' });
  }
});

// @route   GET /api/tmdb/movies/:movieId/similar
// @desc    Get similar movies from TMDB
// @access  Public
router.get('/movies/:movieId/similar', async (req, res) => {
  try {
    const { movieId } = req.params;
    const page = parseInt(req.query.page) || 1;
    
    const data = await tmdbService.getSimilarMovies(movieId, page);
    
    const movies = data.results.map(movie => tmdbService.transformMovieData(movie));
    
    res.json({
      movies,
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results,
        hasNext: data.page < data.total_pages,
        hasPrev: data.page > 1
      }
    });
  } catch (error) {
    console.error('Get similar movies error:', error);
    res.status(500).json({ message: 'Failed to fetch similar movies' });
  }
});

// @route   GET /api/tmdb/genres
// @desc    Get movie genres from TMDB
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    const data = await tmdbService.getGenres();
    res.json({ genres: data.genres });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});

module.exports = router;
