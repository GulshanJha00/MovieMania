const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  overview: {
    type: String,
    required: [true, 'Movie overview is required'],
    maxlength: [2000, 'Overview cannot be more than 2000 characters']
  },
  poster: {
    type: String,
    required: [true, 'Poster URL is required']
  },
  backdrop: {
    type: String,
    required: [true, 'Backdrop URL is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be negative'],
    max: [10, 'Rating cannot be more than 10']
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
  },
  genre: [{
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
      'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
      'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
    ]
  }],
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  director: {
    type: String,
    trim: true
  },
  cast: [String],
  language: {
    type: String,
    default: 'English'
  },
  country: {
    type: String,
    default: 'USA'
  },
  featured: {
    type: Boolean,
    default: false
  },
  popularity: {
    type: Number,
    default: 0
  },
  tags: [String],
  trailer: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better search performance
movieSchema.index({ title: 'text', overview: 'text', genre: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ featured: 1 });

module.exports = mongoose.model('Movie', movieSchema);
