const axios = require('axios');

// Helper function to calculate distance using Haversine formula (Fallback)
const calculateHaversineDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers

  const lat1 = point1.latitude * Math.PI / 180;
  const lat2 = point2.latitude * Math.PI / 180;
  const deltaLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const deltaLon = (point2.longitude - point1.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
};

/**
 * Get distance and duration between two points using Google Maps Distance Matrix API
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @returns {Promise<Object>} - { distance: number (km), duration: number (min) }
 */
const getDistanceAndDuration = async (origin, destination) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn('Google Maps API key is missing. Using Haversine formula.');
      return {
        distance: calculateHaversineDistance(origin, destination),
        duration: Math.round(calculateHaversineDistance(origin, destination) * 2), // Approx 2 min per km
        source: 'haversine'
      };
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    // Use Google Maps Distance Matrix API
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&key=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== 'OK') {
      console.error(`Google Maps API Error Status: ${data.status}`);
      throw new Error(`Google Maps API returned validation error: ${data.error_message || data.status}`);
    }

    if (!data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
      throw new Error('Invalid response structure from Google Maps API');
    }

    const element = data.rows[0].elements[0];

    if (element.status !== 'OK') {
      console.warn(`Route not found by Google Maps: ${element.status}. Using Haversine.`);
      // Used when no route is found (e.g. across oceans or invalid locations)
      return {
        distance: calculateHaversineDistance(origin, destination),
        duration: Math.round(calculateHaversineDistance(origin, destination) * 2),
        source: 'haversine_fallback'
      };
    }

    // API returns coordinates in meters and seconds
    const distanceKm = element.distance.value / 1000;
    const durationMin = Math.round(element.duration.value / 60);

    return {
      distance: Math.round(distanceKm * 100) / 100,
      duration: durationMin,
      source: 'google'
    };

  } catch (error) {
    console.error('Error in Google Maps Service:', error.message);
    // Fallback to Haversine on error
    const dist = calculateHaversineDistance(origin, destination);
    return {
      distance: dist,
      duration: Math.round(dist * 2),
      source: 'haversine_error_fallback'
    };
  }
};

/**
 * Get address details from coordinates (Reverse Geocoding)
 * @param {Object} coordinates - { latitude, longitude }
 * @returns {Promise<String>} - Formatted address
 */
const getAddressFromCoordinates = async (coordinates) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    const latlng = `${coordinates.latitude},${coordinates.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.error('Error in Reverse Geocoding:', error.message);
    return null;
  }
};

/**
 * Get place suggestions based on input text (Box Search)
 * @param {String} input - The text to search for
 * @param {String} sessionToken - Optional session token
 * @returns {Promise<Array>} - List of predictions
 */
const getPlaceAutocomplete = async (input, sessionToken) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key missing');

    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:in`;

    if (sessionToken) {
      url += `&sessiontoken=${sessionToken}`;
    }

    const response = await axios.get(url);

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Maps Places API Error: ${response.data.status}`);
    }

    return response.data.predictions || [];
  } catch (error) {
    console.error('Error in Place Autocomplete:', error.message);
    return [];
  }
};

/**
 * Get coordinates from address or place ID (Geocoding)
 * @param {String} address - Address or Place ID (prefixed with place_id:)
 * @returns {Promise<Object>} - { latitude, longitude, formattedAddress }
 */
const getGeocode = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key missing');

    let url;
    let isPlaceDetails = false;

    // Check if the input is explicitly a place_id passed from frontend
    if (address && address.startsWith('place_id:')) {
      const placeId = address.replace('place_id:', '').trim();
      // Use Place Details API for better reliability with place_ids
      // Requesting geometry and formatted_address
      url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${apiKey}`;
      isPlaceDetails = true;
    } else {
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    }

    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
      console.error(`Google Maps API Error (${isPlaceDetails ? 'Place Details' : 'Geocoding'}): ${response.data.status}`, response.data);
      return null;
    }

    let location;
    let formattedAddress = '';

    if (isPlaceDetails) {
      if (!response.data.result || !response.data.result.geometry) return null;
      location = response.data.result.geometry.location;
      formattedAddress = response.data.result.formatted_address;
    } else {
      if (!response.data.results || response.data.results.length === 0) return null;
      const result = response.data.results[0];
      location = result.geometry.location;
      formattedAddress = result.formatted_address;
    }

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress
    };
  } catch (error) {
    console.error('Error in Geocoding:', error.message);
    return null;
  }
};

module.exports = {
  getDistanceAndDuration,
  getAddressFromCoordinates,
  getPlaceAutocomplete,
  getGeocode
};
