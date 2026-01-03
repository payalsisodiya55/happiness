const express = require('express');
const router = express.Router();
const {
  getAutocomplete,
  getGeocode,
  getReverseGeocode,
  getDistanceMatrix
} = require('../controllers/mapsController');

// All routes are public (or protected by optional auth if needed)
router.get('/autocomplete', getAutocomplete);
router.get('/geocode', getGeocode);
router.get('/reverse-geocode', getReverseGeocode);
router.get('/distance', getDistanceMatrix);

module.exports = router;
