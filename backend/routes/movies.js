const express = require('express');
const Movie = require('../models/Movie');
const { validateMovie } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const { genre, year, rating, search, featured, sortBy = 'year', sortOrder = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (genre) {
      filter.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }
    
    if (year) {
      filter.year = parseInt(year);
    }
    
    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Movie.countDocuments(filter);
    
    res.json({
      movies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMovies: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error while fetching movies' });
  }
});

// @route   GET /api/movies/featured
// @desc    Get featured movies
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const movies = await Movie.find({ featured: true })
      .sort({ rating: -1, year: -1 })
      .limit(6)
      .lean();
    
    res.json({ movies });
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({ message: 'Server error while fetching featured movies' });
  }
});

// @route   GET /api/movies/genres
// @desc    Get all available genres
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json({ genres: genres.sort() });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error while fetching genres' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({ movie });
  } catch (error) {
    console.error('Get movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error while fetching movie' });
  }
});

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private (Admin only)
router.post('/', auth, adminAuth, validateMovie, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    
    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Server error while creating movie' });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private (Admin only)
router.put('/:id', auth, adminAuth, validateMovie, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error while updating movie' });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error while deleting movie' });
  }
});

// @route   GET /api/movies/search/:query
// @desc    Search movies by title, overview, or genre
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } },
        { genre: { $in: [new RegExp(query, 'i')] } },
        { cast: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .sort({ rating: -1, year: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
    const total = await Movie.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } },
        { genre: { $in: [new RegExp(query, 'i')] } },
        { cast: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    res.json({
      movies,
      query,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMovies: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ message: 'Server error while searching movies' });
  }
});

module.exports = router;
