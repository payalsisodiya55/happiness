const asyncHandler = require('../middleware/asyncHandler');
const googleMapsService = require('../services/googleMapsService');

// @desc    Get autocomplete suggestions
// @route   GET /api/maps/autocomplete
// @access  Public
const getAutocomplete = asyncHandler(async (req, res) => {
  const { input, sessionToken } = req.query;

  if (!input) {
    return res.status(400).json({
      success: false,
      message: 'Input text is required'
    });
  }

  try {
    const predictions = await googleMapsService.getPlaceAutocomplete(input, sessionToken);

    res.status(200).json({
      success: true,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error occurred during autocomplete'
    });
  }
});

// @desc    Get geocode (coordinates from address)
// @route   GET /api/maps/geocode
// @access  Public
const getGeocode = asyncHandler(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address is required'
    });
  }

  const result = await googleMapsService.getGeocode(address);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Location not found'
    });
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Get reverse geocode (address from coordinates)
// @route   GET /api/maps/reverse-geocode
// @access  Public
const getReverseGeocode = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }

  const address = await googleMapsService.getAddressFromCoordinates({ latitude, longitude });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { address }
  });
});

// @desc    Get distance and duration
// @route   POST /api/maps/distance
// @access  Public
const getDistanceMatrix = asyncHandler(async (req, res) => {
  // Support both body (POST) and query (GET) parameters
  let origin, destination;

  if (req.method === 'GET') {
    if (req.query.originLat && req.query.originLng) {
      origin = {
        latitude: parseFloat(req.query.originLat),
        longitude: parseFloat(req.query.originLng)
      };
    }
    if (req.query.destLat && req.query.destLng) {
      destination = {
        latitude: parseFloat(req.query.destLat),
        longitude: parseFloat(req.query.destLng)
      };
    }
  } else {
    // POST request logic
    origin = req.body.origin;
    destination = req.body.destination;
  }

  if (!origin || !destination) {
    return res.status(400).json({
      success: false,
      message: 'Origin and destination are required'
    });
  }

  // Ensure origin and destination have latitude and longitude
  if (!origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
    return res.status(400).json({
      success: false,
      message: 'Origin and destination must have latitude and longitude'
    });
  }

  const result = await googleMapsService.getDistanceAndDuration(origin, destination);

  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Could not calculate distance'
    });
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  getAutocomplete,
  getGeocode,
  getReverseGeocode,
  getDistanceMatrix
};
