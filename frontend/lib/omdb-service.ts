import { apiService } from './api';

export interface OMDbMovie {
  imdbId: string;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  genre: string[];
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
  rated: string;
  awards: string;
  boxOffice: string;
  production: string;
  website: string | null;
}

export interface OMDbGenre {
  id: string;
  name: string;
}

export interface OMDbResponse {
  movies: OMDbMovie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OMDbMovieDetails {
  movie: OMDbMovie;
}

class OMDbService {
  // Get popular movies
  async getPopularMovies(): Promise<OMDbResponse> {
    return apiService.request<OMDbResponse>('/omdb/movies/popular');
  }
  
  

  // Get top rated movies
  async getTopRatedMovies(): Promise<OMDbResponse> {
    return apiService.request<OMDbResponse>('/omdb/movies/top-rated');
  }

  // Get trending movies
  async getTrendingMovies(): Promise<OMDbResponse> {
    return apiService.request<OMDbResponse>('/omdb/movies/trending');
  }

  // Get now playing movies
  async getNowPlayingMovies(): Promise<OMDbResponse> {
    return apiService.request<OMDbResponse>('/omdb/movies/now-playing');
  }

  // Get upcoming movies
  async getUpcomingMovies(): Promise<OMDbResponse> {
    return apiService.request<OMDbResponse>('/omdb/movies/upcoming');
  }

  // Search movies
  async searchMovies(query: string, page = 1): Promise<OMDbResponse & { query: string }> {
    return apiService.request<OMDbResponse & { query: string }>(`/omdb/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Get movies by genre
  async getMoviesByGenre(genre: string, limit = 12): Promise<OMDbResponse & { genre: string }> {
    return apiService.request<OMDbResponse & { genre: string }>(`/omdb/movies/genre/${encodeURIComponent(genre)}?limit=${limit}`);
  }

  // Get movie details
  async getMovieDetails(imdbId: string): Promise<OMDbMovieDetails> {
    return apiService.request<OMDbMovieDetails>(`/omdb/movies/${imdbId}`);
  }

  // Get movie by title
  async getMovieByTitle(title: string): Promise<OMDbMovieDetails> {
    return apiService.request<OMDbMovieDetails>(`/omdb/movies/title/${encodeURIComponent(title)}`);
  }

  // Get genres
  async getGenres(): Promise<{ genres: OMDbGenre[] }> {
    return apiService.request<{ genres: OMDbGenre[] }>('/omdb/genres');
  }

  // Helper function to get genre name by ID
  getGenreName(genreId: string, genres: OMDbGenre[]): string {
    const genre = genres.find(g => g.id === genreId);
    return genre ? genre.name : 'Unknown';
  }

  // Helper function to get genre names by IDs
  getGenreNames(genreIds: string[], genres: OMDbGenre[]): string[] {
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

  // Helper function to get movie year range
  getYearRange(movies: OMDbMovie[]): { min: number; max: number } {
    if (movies.length === 0) return { min: 0, max: 0 };
    
    const years = movies.map(movie => movie.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }

  // Helper function to get unique genres from movies
  getUniqueGenres(movies: OMDbMovie[]): string[] {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach(genre => genres.add(genre));
    });
    return Array.from(genres);
  }

  // Helper function to filter movies by rating
  filterByRating(movies: OMDbMovie[], minRating: number): OMDbMovie[] {
    return movies.filter(movie => movie.rating >= minRating);
  }

  // Helper function to filter movies by year
  filterByYear(movies: OMDbMovie[], year: number): OMDbMovie[] {
    return movies.filter(movie => movie.year === year);
  }

  // Helper function to filter movies by genre
  filterByGenre(movies: OMDbMovie[], genre: string): OMDbMovie[] {
    return movies.filter(movie => movie.genre.includes(genre));
  }

  // Helper function to sort movies by rating
  sortByRating(movies: OMDbMovie[], order: 'asc' | 'desc' = 'desc'): OMDbMovie[] {
    return [...movies].sort((a, b) => {
      return order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    });
  }

  // Helper function to sort movies by year
  sortByYear(movies: OMDbMovie[], order: 'asc' | 'desc' = 'desc'): OMDbMovie[] {
    return [...movies].sort((a, b) => {
      return order === 'desc' ? b.year - a.year : a.year - b.year;
    });
  }

  // Helper function to sort movies by popularity
  sortByPopularity(movies: OMDbMovie[], order: 'asc' | 'desc' = 'desc'): OMDbMovie[] {
    return [...movies].sort((a, b) => {
      return order === 'desc' ? b.popularity - a.popularity : a.popularity - b.popularity;
    });
  }

  // Helper function to format box office
  formatBoxOffice(boxOffice: string): string {
    if (boxOffice === 'N/A' || !boxOffice) return 'N/A';
    return boxOffice;
  }

  // Helper function to format awards
  formatAwards(awards: string): string {
    if (awards === 'N/A' || !awards) return 'No awards information';
    return awards;
  }

  // Helper function to get movie age rating
  getAgeRating(rated: string): string {
    if (rated === 'N/A' || !rated) return 'Not Rated';
    return rated;
  }
}

export const omdbService = new OMDbService();
export default omdbService;
