const router = require('express').Router();
const { protect, requireUser } = require('../middleware/auth');
const { getProfile, updateProfile, getBookmarks, toggleBookmark, getMyReviews } = require('../controllers/userController');

router.use(protect, requireUser);
router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/:listingId', toggleBookmark);
router.delete('/bookmarks/:listingId', toggleBookmark);
router.get('/reviews', getMyReviews);

module.exports = router;
