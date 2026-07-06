const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');
const {
  searchListings, getListingBySlug, getNearbyListings, trackPhoneClick, trackMapOpen,
} = require('../controllers/listingController');

router.get('/search', searchListings);
router.get('/nearby', getNearbyListings);
router.get('/:slug', optionalAuth, getListingBySlug);
router.post('/:id/track/phone', trackPhoneClick);
router.post('/:id/track/map', trackMapOpen);

module.exports = router;
