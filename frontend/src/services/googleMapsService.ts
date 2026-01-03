import apiService from './api';

export interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  // Optional detailed address for when we already have it
  detailedAddress?: any;
  lat?: number;
  lng?: number;
}

class GoogleMapsService {
  private isServiceReady: boolean = true;

  constructor() {
    this.isServiceReady = true;
  }

  // Backward compatibility - no initialization needed really
  async initialize(): Promise<void> {
    this.isServiceReady = true;
    return Promise.resolve();
  }

  isReady(): boolean {
    return this.isServiceReady;
  }

  // Get location suggestions from backend proxy
  async getLocationSuggestions(input: string): Promise<LocationSuggestion[]> {
    if (!input.trim()) return [];

    try {
      const response = await apiService.request(`/maps/autocomplete?input=${encodeURIComponent(input)}`, {}, 'public');

      if (response.success && response.data) {
        return response.data.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
          structured_formatting: {
            main_text: prediction.structured_formatting?.main_text || '',
            secondary_text: prediction.structured_formatting?.secondary_text || ''
          }
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting location suggestions:', error);
      return [];
    }
  }

  // Get place details from backend proxy (using Geocoding API)
  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      // For backend proxy, we can't search by placeId directly in Geocoding API easily 
      // without place_id prefix, but our backend maps/geocode endpoint expects an address/placeId.
      // Ideally we pass the description (address) if placeId lookup fails or is not supported directly by simple geocode.
      // But typically we can pass place_id to geocode too. 
      // Let's assume we might need to pass the description for the backend 'geocode' endpoint 
      // which uses `address` parameter.
      // However, the frontend usually calls this after selecting a suggestion.

      // Let's modify the flow slightly: 
      // Providing a method that takes a description as well, or just using place_id if backend supports it.
      // The backend uses address=${address} parameter. Google Geocoding API supports place_id:PLACE_ID.

      const response = await apiService.request(`/maps/geocode?address=place_id:${placeId}`, {}, 'public');

      if (response.success && response.data) {
        const { latitude, longitude, formattedAddress } = response.data;

        // Construct a response object similar to what frontend expects
        // Frontend expects 'detailedAddress' property.
        // Since backend simplified the detailed address components, we might mock/reconstruct it 
        // or just rely on formattedAddress.

        // Let's parse formattedAddress partially if needed, or rely on what backend gives.
        // The backend `getGeocode` currently returns { latitude, longitude, formattedAddress }
        // It doesn't return the full detailed components (sublocality etc) yet in the simplified version.
        // We can update backend or just work with formattedAddress.

        // Creating a simple detailedAddress structure based on formattedAddress
        const parts = formattedAddress.split(',').map((p: string) => p.trim());
        const detailedAddress = {
          formatted_address: formattedAddress,
          locality: parts[parts.length - 3] || '',
          administrative_area_level_1: parts[parts.length - 2]?.split(' ')[0] || '',
          country: 'India', // Assumed
          route: parts[0] || '',
          sublocality: parts.length > 3 ? parts[parts.length - 4] : ''
        };

        return {
          formatted_address: formattedAddress,
          geometry: {
            location: {
              lat: () => latitude,
              lng: () => longitude
            }
          },
          detailedAddress: detailedAddress
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // New method for reverse geocoding
  async getReverseGeocode(lat: number, lng: number): Promise<any> {
    try {
      const response = await apiService.request(`/maps/reverse-geocode?latitude=${lat}&longitude=${lng}`, {}, 'public');

      if (response.success && response.data) {
        const { address } = response.data;
        // Construct a basic detailed address from the formatted string
        const parts = address.split(',').map((p: string) => p.trim());
        const detailedAddress = {
          formatted_address: address,
          locality: parts[parts.length - 3] || '',
          administrative_area_level_1: parts[parts.length - 2]?.split(' ')[0] || '',
          country: parts[parts.length - 1] || 'India',
          sublocality: parts.length > 3 ? parts[parts.length - 4] : ''
        };

        return {
          formattedAddress: address,
          detailedAddress: detailedAddress
        };
      }
      return null;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  }
  // Get distance and duration between two points from backend proxy
  async getDistanceAndDuration(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<{ distance: number; duration: number } | null> {
    try {
      console.log('🔍 [GoogleMapsService] Calculating distance for:', { origin, destination });
      const queryParams = new URLSearchParams({
        originLat: origin.latitude.toString(),
        originLng: origin.longitude.toString(),
        destLat: destination.latitude.toString(),
        destLng: destination.longitude.toString()
      });

      console.log('🔍 [GoogleMapsService] Requesting URL:', `/maps/distance?${queryParams.toString()}`);
      const response = await apiService.request(`/maps/distance?${queryParams.toString()}`, {}, 'public');
      console.log('🔍 [GoogleMapsService] API Response:', response);

      if (response.success && response.data) {
        console.log('✅ [GoogleMapsService] Distance found:', response.data);
        return {
          distance: response.data.distance,
          duration: response.data.duration
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting distance and duration:', error);
      return null;
    }
  }
}

export const googleMapsService = new GoogleMapsService();
