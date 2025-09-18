import { apiService } from './api';

export interface Movie {
  _id: string;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  rating: number;
  year: number;
  genre: string[];
  duration: string;
  director?: string;
  cast?: string[];
  featured?: boolean;
  popularity?: number;
  language?: string;
  country?: string;
  tags?: string[];
  trailer?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieFilters {
  page?: number;
  limit?: number;
  genre?: string | string[];
  year?: number;
  rating?: number;
  search?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface MovieResponse {
  movies: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResponse {
  movies: Movie[];
  query: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class MovieService {
  // Get all movies with optional filtering
  async getMovies(filters?: MovieFilters): Promise<MovieResponse> {
    return apiService.getMovies(filters);
  }

  // Get featured movies
  async getFeaturedMovies(): Promise<Movie[]> {
    const response = await apiService.getFeaturedMovies();
    return response.movies;
  }

  // Get all available genres
  async getGenres(): Promise<string[]> {
    const response = await apiService.getMovieGenres();
    return response.genres;
  }

  // Get single movie by ID
  async getMovie(id: string): Promise<Movie> {
    const response = await apiService.getMovie(id);
    return response.movie;
  }

  // Search movies
  async searchMovies(query: string, page = 1, limit = 12): Promise<SearchResponse> {
    return apiService.searchMovies(query, page, limit);
  }

  // Get movies by genre
  async getMoviesByGenre(genre: string, page = 1, limit = 12): Promise<MovieResponse> {
    return this.getMovies({
      genre,
      page,
      limit,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  }

  // Get movies by year
  async getMoviesByYear(year: number, page = 1, limit = 12): Promise<MovieResponse> {
    return this.getMovies({
      year,
      page,
      limit,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  }

  // Get movies by rating
  async getMoviesByRating(minRating: number, page = 1, limit = 12): Promise<MovieResponse> {
    return this.getMovies({
      rating: minRating,
      page,
      limit,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1, limit = 12): Promise<MovieResponse> {
    return this.getMovies({
      page,
      limit,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  }

  // Get latest movies
  async getLatestMovies(page = 1, limit = 12): Promise<MovieResponse> {
    return this.getMovies({
      page,
      limit,
      sortBy: 'year',
      sortOrder: 'desc'
    });
  }

  // Get personalized recommendations
  async getRecommendations(limit = 10): Promise<Movie[]> {
    const response = await apiService.getRecommendations(limit);
    return response.recommendations;
  }

  // Get AI-powered recommendations
  async getAIRecommendations(genre?: string, mood?: string, preferences?: string): Promise<{
    message: string;
    recommendations: Movie[];
    timestamp: string;
  }> {
    return apiService.getRecommendations(genre, mood, preferences);
  }

  // Helper function to get movie poster URL
  getPosterUrl(poster: string): string {
    if (poster.startsWith('http')) {
      return poster;
    }
    return poster; // Assuming poster is already a valid path
  }

  // Helper function to get movie backdrop URL
  getBackdropUrl(backdrop: string): string {
    if (backdrop.startsWith('http')) {
      return backdrop;
    }
    return backdrop; // Assuming backdrop is already a valid path
  }

  // Helper function to format movie duration
  formatDuration(duration: string): string {
    return duration;
  }

  // Helper function to format movie rating
  formatRating(rating: number): string {
    return `${rating.toFixed(1)}/10`;
  }

  // Helper function to get genre display name
  getGenreDisplayName(genre: string): string {
    const genreMap: { [key: string]: string } = {
      'Sci-Fi': 'Science Fiction',
      'Rom-Com': 'Romantic Comedy',
      'Biography': 'Biography',
      'Documentary': 'Documentary',
      'Musical': 'Musical',
      'Sport': 'Sports',
      'Reality-TV': 'Reality TV',
      'Talk-Show': 'Talk Show',
      'Game-Show': 'Game Show',
      'News': 'News'
    };
    
    return genreMap[genre] || genre;
  }

  // Helper function to get movie year range
  getYearRange(movies: Movie[]): { min: number; max: number } {
    if (movies.length === 0) return { min: 0, max: 0 };
    
    const years = movies.map(movie => movie.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }

  // Helper function to get unique genres from movies
  getUniqueGenres(movies: Movie[]): string[] {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }
}

export const movieService = new MovieService();
export default movieService;
