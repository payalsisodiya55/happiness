const express = require('express');
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavorite
} = require('../controllers/favoritesController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .post(addToFavorites)
  .get(getUserFavorites);

router.route('/:vehicleId')
  .delete(removeFromFavorites);

router.route('/check/:vehicleId')
  .get(checkFavorite);

module.exports = router;

