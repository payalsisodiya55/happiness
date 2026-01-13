const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// @desc    Add vehicle to favorites
// @route   POST /api/favorites
// @access  Private
exports.addToFavorites = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;

  if (!vehicleId) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle ID is required'
    });
  }

  // Check if vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }

  // Check if already in favorites
  const user = await User.findById(req.user.id);
  if (user.favorites.includes(vehicleId)) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle already in favorites'
    });
  }

  // Add to favorites
  user.favorites.push(vehicleId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Vehicle added to favorites',
    data: user.favorites
  });
});

// @desc    Remove vehicle from favorites
// @route   DELETE /api/favorites/:vehicleId
// @access  Private
exports.removeFromFavorites = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  const user = await User.findById(req.user.id);

  // Check if vehicle is in favorites
  const favoriteIndex = user.favorites.indexOf(vehicleId);
  if (favoriteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found in favorites'
    });
  }

  // Remove from favorites
  user.favorites.splice(favoriteIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Vehicle removed from favorites',
    data: user.favorites
  });
});

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getUserFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    success: true,
    count: user.favorites.length,
    data: user.favorites
  });
});

// @desc    Check if vehicle is in favorites
// @route   GET /api/favorites/check/:vehicleId
// @access  Private
exports.checkFavorite = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  const user = await User.findById(req.user.id);
  const isFavorite = user.favorites.includes(vehicleId);

  res.status(200).json({
    success: true,
    isFavorite,
    data: { vehicleId, isFavorite }
  });
});

