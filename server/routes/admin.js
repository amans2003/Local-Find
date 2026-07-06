const router = require('express').Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
  getDashboardStats, getAllListings, adminCreateListing, getFormOptions,
  approveListing, rejectListing, bulkAction, updateListing, toggleVisibility, toggleVerified, deleteListing,
  getAllUsers, toggleUserBan, toggleUserVerify, getAllProviders, updateProviderStatus,
  getFlaggedReviews, moderateReview, getPendingReviews, approveReview, rejectReview,
  seedIndiaLocations,
} = require('../controllers/adminController');
const {
  createCategory, updateCategory, deleteCategory, createCity, updateCity,
} = require('../controllers/categoryController');
const { upload } = require('../config/cloudinary');
const { uploadListingImages } = require('../controllers/providerController');

router.use(protect, requireAdmin);

router.get('/dashboard', getDashboardStats);

router.get('/listings/form-options', getFormOptions);
router.get('/listings', getAllListings);
router.post('/listings/upload',
  (req, _res, next) => { req.uploadFolder = 'listings'; next(); },
  upload.array('images', 10),
  uploadListingImages
);
router.post('/listings', adminCreateListing);
router.patch('/listings/:id/approve', approveListing);
router.patch('/listings/:id/reject', rejectListing);
router.patch('/listings/:id/visibility', toggleVisibility);
router.patch('/listings/:id/verified', toggleVerified);
router.patch('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);
router.post('/listings/bulk', bulkAction);

router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleUserBan);
router.patch('/users/:id/verify', toggleUserVerify);

router.get('/providers', getAllProviders);
router.patch('/providers/:id/status', updateProviderStatus);

router.get('/reviews/pending', getPendingReviews);
router.patch('/reviews/:id/approve', approveReview);
router.patch('/reviews/:id/reject', rejectReview);
router.get('/reviews/flagged', getFlaggedReviews);
router.patch('/reviews/:id/moderate', moderateReview);

router.post('/seed-india-locations', seedIndiaLocations);

router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/cities', createCity);
router.patch('/cities/:id', updateCity);

module.exports = router;
