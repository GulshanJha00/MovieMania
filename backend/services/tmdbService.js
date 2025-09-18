const axios = require('axios');

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || 'your-tmdb-api-key';
    this.baseURL = 'https://api.themoviedb.org/3';
    this.imageBaseURL = 'https://image.tmdb.org/t/p';
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch data from TMDB API');
    }
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    return this.makeRequest('/movie/popular', { page });
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1) {
    return this.makeRequest('/movie/top_rated', { page });
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1) {
    return this.makeRequest('/movie/now_playing', { page });
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1) {
    return this.makeRequest('/movie/upcoming', { page });
  }

  // Search movies
  async searchMovies(query, page = 1) {
    return this.makeRequest('/search/movie', { 
      query, 
      page,
      include_adult: false 
    });
  }

  // Get movies by genre
  async getMoviesByGenre(genreId, page = 1) {
    return this.makeRequest('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    });
  }

  // Get movie details
  async getMovieDetails(movieId) {
    return this.makeRequest(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,reviews'
    });
  }

  // Get movie genres
  async getGenres() {
    return this.makeRequest('/genre/movie/list');
  }

  // Get trending movies
  async getTrendingMovies(timeWindow = 'week', page = 1) {
    return this.makeRequest(`/trending/movie/${timeWindow}`, { page });
  }

  // Get recommended movies
  async getRecommendedMovies(movieId, page = 1) {
    return this.makeRequest(`/movie/${movieId}/recommendations`, { page });
  }

  // Get similar movies
  async getSimilarMovies(movieId, page = 1) {
    return this.makeRequest(`/movie/${movieId}/similar`, { page });
  }

  // Transform TMDB movie data to our format
  transformMovieData(tmdbMovie) {
    return {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      poster: tmdbMovie.poster_path ? `${this.imageBaseURL}/w500${tmdbMovie.poster_path}` : '/placeholder.svg',
      backdrop: tmdbMovie.backdrop_path ? `${this.imageBaseURL}/w1280${tmdbMovie.backdrop_path}` : '/placeholder.svg',
      rating: tmdbMovie.vote_average,
      year: new Date(tmdbMovie.release_date).getFullYear(),
      genre: tmdbMovie.genre_ids || [],
      duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : 'N/A',
      director: tmdbMovie.director || 'N/A',
      cast: tmdbMovie.cast || [],
      language: tmdbMovie.original_language || 'en',
      country: tmdbMovie.production_countries?.[0]?.name || 'N/A',
      featured: tmdbMovie.popularity > 50,
      popularity: tmdbMovie.popularity,
      releaseDate: tmdbMovie.release_date,
      adult: tmdbMovie.adult || false,
      voteCount: tmdbMovie.vote_count
    };
  }

  // Get image URL
  getImageURL(path, size = 'w500') {
    if (!path) return '/placeholder.svg';
    return `${this.imageBaseURL}/${size}${path}`;
  }

  // Get movie trailer
  async getMovieTrailer(movieId) {
    try {
      const data = await this.makeRequest(`/movie/${movieId}/videos`);
      const trailer = data.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  }
}

module.exports = new TMDBService();
