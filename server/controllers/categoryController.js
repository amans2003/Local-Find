const Category = require('../models/Category');
const City = require('../models/City');
const { success, error } = require('../utils/apiResponse');
const { get, set, delPattern, CATEGORY_TTL } = require('../services/cacheService');

exports.getCategories = async (req, res) => {
  const cached = await get('categories:all');
  if (cached) return res.status(200).json(cached);

  const categories = await Category.find({ isActive: true }).lean();
  const responseData = { success: true, message: 'Success', data: categories };
  await set('categories:all', responseData, CATEGORY_TTL);
  res.status(200).json(responseData);
};

exports.getCategoryBySlug = async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!cat) return error(res, 'Category not found', 404);
  success(res, cat);
};

exports.getCities = async (req, res) => {
  const cached = await get('cities:all');
  if (cached) return res.status(200).json(cached);

  const cities = await City.find({ isActive: true }).select('name slug state subLocations').lean();
  const responseData = { success: true, message: 'Success', data: cities };
  await set('cities:all', responseData, CATEGORY_TTL);
  res.status(200).json(responseData);
};

exports.getCityBySlug = async (req, res) => {
  const city = await City.findOne({ slug: req.params.slug, isActive: true });
  if (!city) return error(res, 'City not found', 404);
  success(res, city);
};

exports.createCategory = async (req, res) => {
  const cat = await Category.create(req.body);
  await delPattern('categories:*');
  success(res, cat, 'Category created', 201);
};

exports.updateCategory = async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!cat) return error(res, 'Category not found', 404);
  await delPattern('categories:*');
  success(res, cat, 'Category updated');
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  await delPattern('categories:*');
  success(res, {}, 'Category deactivated');
};

exports.createCity = async (req, res) => {
  const city = await City.create(req.body);
  await delPattern('cities:*');
  success(res, city, 'City created', 201);
};

exports.updateCity = async (req, res) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!city) return error(res, 'City not found', 404);
  await delPattern('cities:*');
  success(res, city, 'City updated');
};
