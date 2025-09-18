const axios = require('axios');

class OMDbService {
  constructor() {
    this.apiKey = process.env.OMDB_API_KEY || 'your-omdb-api-key';
    this.baseURL = 'http://www.omdbapi.com';
    this.posterBaseURL = 'https://img.omdbapi.com';
  }

  async makeRequest(params = {}) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          apikey: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('OMDb API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch data from OMDb API');
    }
  }

  // Search movies by title
  async searchMovies(query, page = 1, type = 'movie') {
    const response = await this.makeRequest({
      s: query,
      page: page,
      type: type
    });
    
    if (response.Response === 'False') {
      throw new Error(response.Error || 'No movies found');
    }
    
    return {
      movies: response.Search || [],
      totalResults: parseInt(response.totalResults) || 0,
      page: page,
      totalPages: Math.ceil((parseInt(response.totalResults) || 0) / 10)
    };
  }

  // Get movie details by IMDB ID
  async getMovieDetails(imdbId) {
    const response = await this.makeRequest({
      i: imdbId,
      plot: 'full'
    });
    
    if (response.Response === 'False') {
      throw new Error(response.Error || 'Movie not found');
    }
    
    return response;
  }

  // Get popular movies (we'll use a curated list since OMDb doesn't have trending)
  async getPopularMovies() {
    // Popular movie titles for 2023-2024
    const popularTitles = [
      'Oppenheimer', 'Barbie', 'Spider-Man: Across the Spider-Verse', 
      'Guardians of the Galaxy Vol. 3', 'Fast X', 'The Super Mario Bros. Movie',
      'John Wick: Chapter 4', 'Mission: Impossible - Dead Reckoning Part One',
      'Avatar: The Way of Water', 'Top Gun: Maverick', 'Black Panther: Wakanda Forever',
      'Thor: Love and Thunder', 'Doctor Strange in the Multiverse of Madness',
      'The Batman', 'Jurassic World Dominion', 'Minions: The Rise of Gru',
      'Lightyear', 'Sonic the Hedgehog 2', 'Uncharted', 'The Lost City'
    ];

    const movies = [];
    for (const title of popularTitles.slice(0, 12)) {
      try {
        const response = await this.makeRequest({
          t: title,
          plot: 'short'
        });
        if (response.Response === 'True') {
          movies.push(this.transformMovieData(response));
        }
      } catch (error) {
        console.error(`Error fetching ${title}:`, error.message);
      }
    }
    
    return {
      movies,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMovies: movies.length,
        hasNext: false,
        hasPrev: false
      }
    };
  }

  // Get top rated movies (curated list)
  async getTopRatedMovies() {
    const topRatedTitles = [
      'The Shawshank Redemption', 'The Godfather', 'The Dark Knight',
      'Pulp Fiction', 'Forrest Gump', 'Inception', 'The Matrix',
      'Goodfellas', 'The Lord of the Rings: The Fellowship of the Ring',
      'Fight Club', 'The Lord of the Rings: The Return of the King',
      'Star Wars: Episode V - The Empire Strikes Back', 'The Godfather Part II',
      'The Lord of the Rings: The Two Towers', 'The Good, the Bad and the Ugly',
      'The Silence of the Lambs', 'It\'s a Wonderful Life', 'Casablanca',
      'City of God', 'Saving Private Ryan'
    ];

    const movies = [];
    for (const title of topRatedTitles.slice(0, 12)) {
      try {
        const response = await this.makeRequest({
          t: title,
          plot: 'short'
        });
        if (response.Response === 'True') {
          movies.push(this.transformMovieData(response));
        }
      } catch (error) {
        console.error(`Error fetching ${title}:`, error.message);
      }
    }
    
    return {
      movies,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMovies: movies.length,
        hasNext: false,
        hasPrev: false
      }
    };
  }

  // Get movies by genre (we'll search for specific genre keywords)
  async getMoviesByGenre(genre, limit = 12) {
    const genreKeywords = {
      'Action': ['action', 'adventure', 'thriller'],
      'Comedy': ['comedy', 'funny'],
      'Drama': ['drama', 'romance'],
      'Horror': ['horror', 'scary'],
      'Sci-Fi': ['sci-fi', 'science fiction', 'space'],
      'Romance': ['romance', 'love', 'romantic'],
      'Thriller': ['thriller', 'suspense', 'mystery'],
      'Crime': ['crime', 'gangster', 'detective'],
      'Fantasy': ['fantasy', 'magic', 'supernatural'],
      'Animation': ['animation', 'animated', 'cartoon']
    };

    const keywords = genreKeywords[genre] || [genre.toLowerCase()];
    const movies = [];
    
    for (const keyword of keywords.slice(0, 3)) {
      try {
        const response = await this.searchMovies(keyword, 1);
        const genreMovies = response.movies.slice(0, Math.ceil(limit / keywords.length));
        for (const movie of genreMovies) {
          if (movies.length < limit) {
            movies.push(this.transformSearchResult(movie));
          }
        }
      } catch (error) {
        console.error(`Error searching for ${keyword}:`, error.message);
      }
    }
    
    return {
      movies: movies.slice(0, limit),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMovies: movies.length,
        hasNext: false,
        hasPrev: false
      }
    };
  }

  // Transform movie data from OMDb response
  transformMovieData(omdbMovie) {
    return {
      imdbId: omdbMovie.imdbID,
      title: omdbMovie.Title,
      overview: omdbMovie.Plot || 'No plot available',
      poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder.svg',
      backdrop: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder.svg',
      rating: parseFloat(omdbMovie.imdbRating) || 0,
      year: parseInt(omdbMovie.Year) || new Date().getFullYear(),
      genre: omdbMovie.Genre ? omdbMovie.Genre.split(', ').map(g => g.trim()) : [],
      duration: omdbMovie.Runtime || 'N/A',
      director: omdbMovie.Director || 'N/A',
      cast: omdbMovie.Actors ? omdbMovie.Actors.split(', ').map(a => a.trim()) : [],
      language: omdbMovie.Language || 'English',
      country: omdbMovie.Country || 'N/A',
      featured: parseFloat(omdbMovie.imdbRating) > 7.5,
      popularity: parseFloat(omdbMovie.imdbRating) * 10 || 0,
      releaseDate: omdbMovie.Released || omdbMovie.Year,
      adult: omdbMovie.Rated === 'R' || omdbMovie.Rated === 'NC-17',
      voteCount: parseInt(omdbMovie.imdbVotes?.replace(/,/g, '')) || 0,
      rated: omdbMovie.Rated || 'N/A',
      awards: omdbMovie.Awards || 'N/A',
      boxOffice: omdbMovie.BoxOffice || 'N/A',
      production: omdbMovie.Production || 'N/A',
      website: omdbMovie.Website || null
    };
  }

  // Transform search result
  transformSearchResult(searchResult) {
    return {
      imdbId: searchResult.imdbID,
      title: searchResult.Title,
      overview: 'Click to view details',
      poster: searchResult.Poster !== 'N/A' ? searchResult.Poster : '/placeholder.svg',
      backdrop: searchResult.Poster !== 'N/A' ? searchResult.Poster : '/placeholder.svg',
      rating: 0, // Will be filled when getting details
      year: parseInt(searchResult.Year) || new Date().getFullYear(),
      genre: [],
      duration: 'N/A',
      director: 'N/A',
      cast: [],
      language: 'English',
      country: 'N/A',
      featured: false,
      popularity: 0,
      releaseDate: searchResult.Year,
      adult: false,
      voteCount: 0,
      rated: 'N/A',
      awards: 'N/A',
      boxOffice: 'N/A',
      production: 'N/A',
      website: null
    };
  }

  // Get image URL
  getImageURL(poster, size = 'w500') {
    if (!poster || poster === '/placeholder.svg') return '/placeholder.svg';
    return poster;
  }

  // Get movie by title
  async getMovieByTitle(title) {
    const response = await this.makeRequest({
      t: title,
      plot: 'full'
    });
    
    if (response.Response === 'False') {
      throw new Error(response.Error || 'Movie not found');
    }
    
    return this.transformMovieData(response);
  }
}

module.exports = new OMDbService();
