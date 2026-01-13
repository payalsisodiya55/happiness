import { toast } from '@/hooks/use-toast';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

class FavoritesApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Get auth token from localStorage - check multiple possible keys
    let token = localStorage.getItem('token') ||
                localStorage.getItem('userToken') ||
                localStorage.getItem('authToken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));

        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userToken');
          localStorage.removeItem('authToken');
          window.location.href = '/auth';
          throw new Error('Authentication required. Please login again.');
        }

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Add vehicle to favorites
  async addToFavorites(vehicleId: string) {
    try {
      const response = await this.request('/favorites', {
        method: 'POST',
        body: JSON.stringify({ vehicleId }),
      });

      if (response.success) {
        toast({
          description: "Added to favorites",
        });
        return response;
      } else {
        throw new Error(response.message || 'Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to favorites",
      });
      throw error;
    }
  }

  // Remove vehicle from favorites
  async removeFromFavorites(vehicleId: string) {
    try {
      const response = await this.request(`/favorites/${vehicleId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        toast({
          description: "Removed from favorites",
        });
        return response;
      } else {
        throw new Error(response.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove from favorites",
      });
      throw error;
    }
  }

  // Get user favorites
  async getUserFavorites() {
    try {
      const response = await this.request('/favorites');

      if (response.success) {
        return response.data || [];
      } else {
        throw new Error(response.message || 'Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load favorites",
      });
      throw error;
    }
  }

  // Check if vehicle is in favorites
  async checkFavorite(vehicleId: string) {
    try {
      const response = await this.request(`/favorites/check/${vehicleId}`);

      if (response.success) {
        return response.isFavorite || false;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const favoritesApi = new FavoritesApiService(API_BASE_URL);
export default favoritesApi;

