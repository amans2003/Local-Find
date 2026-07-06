const router = require('express').Router();
const {
  getCategories, getCategoryBySlug, getCities, getCityBySlug,
} = require('../controllers/categoryController');

router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/cities', getCities);
router.get('/cities/:slug', getCityBySlug);

module.exports = router;
