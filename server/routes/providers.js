const router = require('express').Router();
const { protect, requireProvider } = require('../middleware/auth');
const { register, login, refresh, logout, forgotPassword, resetPassword } = require('../controllers/providerAuthController');
const { getMyListings, getListingAnalytics, uploadListingImages } = require('../controllers/providerController');
const { createListing, updateListing, deleteListing } = require('../controllers/listingController');
const { authLimiter, uploadLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

router.use(protect, requireProvider);
router.get('/listings', getMyListings);
router.post('/listings', createListing);
router.patch('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);
router.get('/listings/:id/analytics', getListingAnalytics);
router.post(
  '/upload',
  uploadLimiter,
  (req, _res, next) => { req.uploadFolder = 'listings'; next(); },
  upload.array('images', 10),
  uploadListingImages
);

module.exports = router;
