const router = require('express').Router();
const { protect, requireUser } = require('../middleware/auth');
const {
  getListingReviews, createReview, updateReview, deleteReview, flagReview,
} = require('../controllers/reviewController');

router.get('/listing/:listingId', getListingReviews);
router.post('/listing/:listingId', protect, requireUser, createReview);
router.patch('/:id', protect, requireUser, updateReview);
router.delete('/:id', protect, requireUser, deleteReview);
router.post('/:id/flag', protect, requireUser, flagReview);

module.exports = router;
