import { apiService } from './api';

export interface TMDBMovie {
  tmdbId: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  genre: number[];
  duration: string;
  director: string;
  cast: string[];
  language: string;
  country: string;
  featured: boolean;
  popularity: number;
  releaseDate: string;
  adult: boolean;
  voteCount: number;
  trailer?: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBResponse {
  movies: TMDBMovie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TMDBMovieDetails {
  movie: TMDBMovie;
}

class TMDBService {
  // Get popular movies
  async getPopularMovies(page = 1): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/popular?page=${page}`);
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/top-rated?page=${page}`);
  }

  // Get trending movies
  async getTrendingMovies(page = 1, timeWindow = 'week'): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/trending?page=${page}&time_window=${timeWindow}`);
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/now-playing?page=${page}`);
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/upcoming?page=${page}`);
  }

  // Search movies
  async searchMovies(query: string, page = 1): Promise<TMDBResponse & { query: string }> {
    return apiService.request<TMDBResponse & { query: string }>(`/tmdb/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse & { genreId: number }> {
    return apiService.request<TMDBResponse & { genreId: number }>(`/tmdb/movies/genre/${genreId}?page=${page}`);
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return apiService.request<TMDBMovieDetails>(`/tmdb/movies/${movieId}`);
  }

  // Get movie recommendations
  async getMovieRecommendations(movieId: number, page = 1): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/${movieId}/recommendations?page=${page}`);
  }

  // Get similar movies
  async getSimilarMovies(movieId: number, page = 1): Promise<TMDBResponse> {
    return apiService.request<TMDBResponse>(`/tmdb/movies/${movieId}/similar?page=${page}`);
  }

  // Get genres
  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    return apiService.request<{ genres: TMDBGenre[] }>('/tmdb/genres');
  }

  // Helper function to get genre name by ID
  getGenreName(genreId: number, genres: TMDBGenre[]): string {
    const genre = genres.find(g => g.id === genreId);
    return genre ? genre.name : 'Unknown';
  }

  // Helper function to get genre names by IDs
  getGenreNames(genreIds: number[], genres: TMDBGenre[]): string[] {
    return genreIds.map(id => this.getGenreName(id, genres));
  }

  // Helper function to format rating
  formatRating(rating: number): string {
    return `${rating.toFixed(1)}/10`;
  }

  // Helper function to format duration
  formatDuration(duration: string): string {
    return duration;
  }

  // Helper function to get year from release date
  getYear(releaseDate: string): number {
    return new Date(releaseDate).getFullYear();
  }

  // Helper function to check if movie is recent (within last 2 years)
  isRecentMovie(releaseDate: string): boolean {
    const movieYear = new Date(releaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - movieYear <= 2;
  }

  // Helper function to get movie poster URL
  getPosterUrl(poster: string): string {
    if (poster.startsWith('http')) {
      return poster;
    }
    return poster || '/placeholder.svg';
  }

  // Helper function to get movie backdrop URL
  getBackdropUrl(backdrop: string): string {
    if (backdrop.startsWith('http')) {
      return backdrop;
    }
    return backdrop || '/placeholder.svg';
  }

  // Helper function to get movie trailer URL
  getTrailerUrl(trailer?: string): string | null {
    return trailer || null;
  }

  // Helper function to get movie year range
  getYearRange(movies: TMDBMovie[]): { min: number; max: number } {
    if (movies.length === 0) return { min: 0, max: 0 };
    
    const years = movies.map(movie => movie.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }

  // Helper function to get unique genres from movies
  getUniqueGenres(movies: TMDBMovie[]): number[] {
    const genres = new Set<number>();
    movies.forEach(movie => {
      movie.genre.forEach(genreId => genres.add(genreId));
    });
    return Array.from(genres);
  }

  // Helper function to filter movies by rating
  filterByRating(movies: TMDBMovie[], minRating: number): TMDBMovie[] {
    return movies.filter(movie => movie.rating >= minRating);
  }

  // Helper function to filter movies by year
  filterByYear(movies: TMDBMovie[], year: number): TMDBMovie[] {
    return movies.filter(movie => movie.year === year);
  }

  // Helper function to filter movies by genre
  filterByGenre(movies: TMDBMovie[], genreId: number): TMDBMovie[] {
    return movies.filter(movie => movie.genre.includes(genreId));
  }

  // Helper function to sort movies by rating
  sortByRating(movies: TMDBMovie[], order: 'asc' | 'desc' = 'desc'): TMDBMovie[] {
    return [...movies].sort((a, b) => {
      return order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    });
  }

  // Helper function to sort movies by year
  sortByYear(movies: TMDBMovie[], order: 'asc' | 'desc' = 'desc'): TMDBMovie[] {
    return [...movies].sort((a, b) => {
      return order === 'desc' ? b.year - a.year : a.year - b.year;
    });
  }

  // Helper function to sort movies by popularity
  sortByPopularity(movies: TMDBMovie[], order: 'asc' | 'desc' = 'desc'): TMDBMovie[] {
    return [...movies].sort((a, b) => {
      return order === 'desc' ? b.popularity - a.popularity : a.popularity - b.popularity;
    });
  }
}

export const tmdbService = new TMDBService();
export default tmdbService;
