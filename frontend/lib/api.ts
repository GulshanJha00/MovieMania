const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.setToken(response.token);
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async verifyToken(token: string) {
    return this.request<{ valid: boolean; user: any }>('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Movie methods
  async getMovies(params?: {
    page?: number;
    limit?: number;
    genre?: string | string[];
    year?: number;
    rating?: number;
    search?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/movies?${queryString}` : '/movies';
    
    return this.request<{
      movies: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalMovies: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(endpoint);
  }

  async getFeaturedMovies() {
    return this.request<{ movies: any[] }>('/movies/featured');
  }

  async getMovieGenres() {
    return this.request<{ genres: string[] }>('/movies/genres');
  }

  async getMovie(id: string) {
    return this.request<{ movie: any }>(`/movies/${id}`);
  }

  async searchMovies(query: string, page = 1, limit = 12) {
    return this.request<{
      movies: any[];
      query: string;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalMovies: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/movies/search/${encodeURIComponent(query)}?page=${page}&limit=${limit}`);
  }

  // User methods
  async getUserProfile() {
    return this.request<{ user: any }>('/users/profile');
  }

  async updateProfile(profileData: { name?: string; email?: string; preferences?: any }) {
    return this.request<{ message: string; user: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updatePreferences(preferences: { favoriteGenres?: string[]; language?: string }) {
    return this.request<{ message: string; user: any }>('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async getFavorites() {
    return this.request<{ favorites: any[] }>('/users/favorites');
  }

  async addToFavorites(movieId: string) {
    return this.request<{ message: string; favorites: string[] }>(`/users/favorites/${movieId}`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(movieId: string) {
    return this.request<{ message: string; favorites: string[] }>(`/users/favorites/${movieId}`, {
      method: 'DELETE',
    });
  }

  async getRecommendations(limit = 10) {
    return this.request<{ recommendations: any[] }>(`/users/recommendations?limit=${limit}`);
  }

  // Chat methods
  async sendChatMessage(message: string, conversationHistory: any[] = []) {
    return this.request<{ message: string; timestamp: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory }),
    });
  }

  async getRecommendations(genre?: string, mood?: string, preferences?: string) {
    return this.request<{
      message: string;
      recommendations: any[];
      timestamp: string;
    }>('/chat/recommend', {
      method: 'POST',
      body: JSON.stringify({ genre, mood, preferences }),
    });
  }

  async getChatSuggestions() {
    return this.request<{ suggestions: string[] }>('/chat/suggestions');
  }

  // Utility methods
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  clearToken() {
    this.setToken(null);
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;
