const express = require('express');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/users/favorites
// @desc    Get user's favorite movies
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .select('favorites');
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error while fetching favorites' });
  }
});

// @route   POST /api/users/favorites/:movieId
// @desc    Add movie to favorites
// @access  Private
router.post('/favorites/:imdbId', auth, async (req, res) => {
    const { imdbId } = req.params;
    console.log("imdbId", imdbId);
    const user = await User.findById(req.user._id);
  
    if (user.favorites.includes(imdbId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
  
    user.favorites.push(imdbId);
    await user.save();
  
    res.json({ 
      message: 'Movie added to favorites',
      favorites: user.favorites 
    });
  });

// router.post('/favorites/:movieId', auth, async (req, res) => {
//   try {
//     const { movieId } = req.params;
    
//     // Check if movie exists
//     const movie = await Movie.findById(movieId);
//     if (!movie) {
//       return res.status(404).json({ message: 'Movie not found' });
//     }
    
//     // Check if already in favorites
//     const user = await User.findById(req.user._id);
//     if (user.favorites.includes(movieId)) {
//       return res.status(400).json({ message: 'Movie already in favorites' });
//     }
    
//     // Add to favorites
//     user.favorites.push(movieId);
//     await user.save();
    
//     res.json({ 
//       message: 'Movie added to favorites',
//       favorites: user.favorites 
//     });
//   } catch (error) {
//     console.error('Add to favorites error:', error);
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Movie not found' });
//     }
//     res.status(500).json({ message: 'Server error while adding to favorites' });
//   }
// });

// @route   DELETE /api/users/favorites/:movieId
// @desc    Remove movie from favorites
// @access  Private
// router.delete('/favorites/:movieId', auth, async (req, res) => {
//   try {
//     const { movieId } = req.params;
    
//     const user = await User.findById(req.user._id);
//     const index = user.favorites.indexOf(movieId);
    
//     if (index === -1) {
//       return res.status(400).json({ message: 'Movie not in favorites' });
//     }
    
//     user.favorites.splice(index, 1);
//     await user.save();
    
//     res.json({ 
//       message: 'Movie removed from favorites',
//       favorites: user.favorites 
//     });
//   } catch (error) {
//     console.error('Remove from favorites error:', error);
//     res.status(500).json({ message: 'Server error while removing from favorites' });
//   }
// });

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .select('-password');
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

router.delete('/favorites/:imdbId', auth, async (req, res) => {
    const { imdbId } = req.params;
    const user = await User.findById(req.user._id);
  
    user.favorites = user.favorites.filter(fav => fav !== imdbId);
    await user.save();
  
    res.json({ 
      message: 'Movie removed from favorites',
      favorites: user.favorites 
    });
  });
  

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('preferences.favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array'),
  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language must be between 2 and 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { name, email, preferences } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
      updateData.email = email;
    }
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array'),
  body('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language must be between 2 and 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { favoriteGenres, language } = req.body;
    const preferences = { ...req.user.preferences };
    
    if (favoriteGenres !== undefined) preferences.favoriteGenres = favoriteGenres;
    if (language !== undefined) preferences.language = language;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Preferences updated successfully',
      user
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error while updating preferences' });
  }
});

// @route   GET /api/users/recommendations
// @desc    Get personalized movie recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const limit = parseInt(req.query.limit) || 10;
    
    // Get user's favorite genres
    const favoriteGenres = user.preferences?.favoriteGenres || [];
    
    let query = {};
    
    if (favoriteGenres.length > 0) {
      query.genre = { $in: favoriteGenres };
    }
    
    // Exclude already favorited movies
    if (user.favorites.length > 0) {
      query._id = { $nin: user.favorites };
    }
    
    const recommendations = await Movie.find(query)
      .sort({ rating: -1, year: -1 })
      .limit(limit)
      .lean();
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error while fetching recommendations' });
  }
});

module.exports = router;
