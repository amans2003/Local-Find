const User = require('../models/User');
const Provider = require('../models/Provider');
const Listing = require('../models/Listing');
const Category = require('../models/Category');
const City = require('../models/City');
const INDIA_LOCATIONS = require('../data/indiaLocations');
const Review = require('../models/Review');
const Analytics = require('../models/Analytics');
const { success, error, paginated } = require('../utils/apiResponse');
const { del, delPattern } = require('../services/cacheService');
const { sendListingStatusEmail } = require('../services/emailService');

exports.adminCreateListing = async (req, res) => {
  const {
    name, category, subCategory, city, subLocation = '', address,
    phone = [], email = '', website = '', description = '',
    status = 'active', isActive, isVerified = false,
    dynamicFields = {}, images = [], coordinates,
  } = req.body;

  if (!name || !category || !city || !address)
    return error(res, 'Name, category, city and address are required', 400);

  const listing = await Listing.create({
    name, category, subCategory, city, subLocation, address,
    phone: Array.isArray(phone) ? phone : [phone].filter(Boolean),
    email, website, description,
    status,
    isActive: isActive !== undefined ? isActive : status === 'active',
    isVerified,
    dynamicFields,
    images,
    coordinates: coordinates || { type: 'Point', coordinates: [0, 0] },
    listedBy: { ref: 'User', id: req.user._id },
  });

  await delPattern('search:*');
  success(res, listing, 'Listing created', 201);
};

exports.seedIndiaLocations = async (req, res) => {
  const { replace = false } = req.body;
  const slugify = require('slugify');

  if (replace) {
    await City.deleteMany({});
    // Drop and recreate the slug index to clear any stale unique violations
    try { await City.collection.dropIndex('slug_1'); } catch {}
    await City.syncIndexes();
  }

  // Build a set of existing name|state pairs to skip
  const existing = await City.find({}, 'name state').lean();
  const existingSet = new Set(existing.map((c) => `${c.name}|${c.state}`));

  const toInsert = INDIA_LOCATIONS
    .filter((loc) => !existingSet.has(`${loc.name}|${loc.state}`))
    .map((loc) => ({
      ...loc,
      slug: slugify(`${loc.name}-${loc.state}`, { lower: true, strict: true }),
      isActive: true,
    }));

  const skipped = INDIA_LOCATIONS.length - toInsert.length;

  if (toInsert.length > 0) {
    await City.insertMany(toInsert, { ordered: false });
  }

  await delPattern('cities:*');

  success(res, { added: toInsert.length, skipped, total: INDIA_LOCATIONS.length },
    `Seeded ${toInsert.length} cities (${skipped} already existed)`);
};

exports.getFormOptions = async (req, res) => {
  const [categories, cities] = await Promise.all([
    Category.find({ isActive: true }).select('name subCategories').lean(),
    City.find({ isActive: true }).select('name state slug subLocations').lean(),
  ]);
  success(res, { categories, cities });
};

exports.getDashboardStats = async (req, res) => {
  const [totalListings, pendingListings, totalUsers, totalProviders] = await Promise.all([
    Listing.countDocuments({ isActive: true }),
    Listing.countDocuments({ status: 'pending' }),
    User.countDocuments({ role: 'user' }),
    Provider.countDocuments(),
  ]);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const dailyListings = await Listing.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const categoryDistribution = await Listing.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const cityDistribution = await Listing.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  success(res, {
    kpis: { totalListings, pendingListings, totalUsers, totalProviders },
    dailyListings,
    categoryDistribution,
    cityDistribution,
  });
};

exports.getAllListings = async (req, res) => {
  const { city, category, status, page = 1, limit = 20, q } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(city, 'i');
  if (category) filter.category = new RegExp(category, 'i');
  if (status) filter.status = status;
  if (q) filter.$text = { $search: q };

  const [listings, total] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
    Listing.countDocuments(filter),
  ]);
  paginated(res, listings, total, page, limit);
};

exports.approveListing = async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: 'active', isActive: true, rejectionReason: '' },
    { new: true }
  );
  if (!listing) return error(res, 'Listing not found', 404);

  if (listing.listedBy.ref === 'Provider') {
    const provider = await Provider.findById(listing.listedBy.id);
    if (provider) sendListingStatusEmail(provider.email, listing.name, 'approved');
  }

  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, listing, 'Listing approved');
};

exports.rejectListing = async (req, res) => {
  const { reason } = req.body;
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', isActive: false, rejectionReason: reason || '' },
    { new: true }
  );
  if (!listing) return error(res, 'Listing not found', 404);

  if (listing.listedBy.ref === 'Provider') {
    const provider = await Provider.findById(listing.listedBy.id);
    if (provider) sendListingStatusEmail(provider.email, listing.name, 'rejected', reason);
  }

  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, listing, 'Listing rejected');
};

exports.bulkAction = async (req, res) => {
  const { ids, action } = req.body;
  const statusMap = { approve: { status: 'active', isActive: true }, reject: { status: 'rejected', isActive: false }, delete: { isActive: false, status: 'draft' } };
  if (!statusMap[action]) return error(res, 'Invalid action', 400);
  await Listing.updateMany({ _id: { $in: ids } }, statusMap[action]);
  await delPattern('search:*');
  success(res, {}, `Bulk ${action} applied to ${ids.length} listings`);
};

exports.updateListing = async (req, res) => {
  const allowed = ['name', 'category', 'subCategory', 'city', 'subLocation', 'address',
    'phone', 'email', 'website', 'description', 'status', 'isActive', 'isVerified',
    'dynamicFields', 'images', 'coordinates'];
  const update = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );
  const listing = await Listing.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!listing) return error(res, 'Listing not found', 404);
  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, listing, 'Listing updated');
};

exports.toggleVisibility = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return error(res, 'Listing not found', 404);
  listing.isActive = !listing.isActive;
  await listing.save();
  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, { isActive: listing.isActive }, listing.isActive ? 'Listing is now visible' : 'Listing hidden from public');
};

exports.toggleVerified = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return error(res, 'Listing not found', 404);
  listing.isVerified = !listing.isVerified;
  await listing.save();
  await del(`listing:${listing.slug}`);
  success(res, { isVerified: listing.isVerified }, listing.isVerified ? 'Listing marked as verified' : 'Verified badge removed');
};

exports.deleteListing = async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) return error(res, 'Listing not found', 404);
  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, {}, 'Listing permanently deleted');
};

exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, q } = req.query;
  const filter = { role: 'user' };
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);
  paginated(res, users, total, page, limit);
};

exports.toggleUserBan = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return error(res, 'User not found', 404);
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  success(res, { isActive: user.isActive }, `User ${user.isActive ? 'unbanned' : 'banned'}`);
};

exports.toggleUserVerify = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return error(res, 'User not found', 404);
  user.isVerified = !user.isVerified;
  await user.save({ validateBeforeSave: false });
  success(res, { isVerified: user.isVerified }, `User ${user.isVerified ? 'verified' : 'unverified'}`);
};

exports.getAllProviders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};
  const [providers, total] = await Promise.all([
    Provider.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
    Provider.countDocuments(filter),
  ]);
  paginated(res, providers, total, page, limit);
};

exports.updateProviderStatus = async (req, res) => {
  const { status } = req.body;
  const provider = await Provider.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!provider) return error(res, 'Provider not found', 404);
  success(res, provider, `Provider status updated to ${status}`);
};

exports.getPendingReviews = async (req, res) => {
  const reviews = await Review.find({ isApproved: false, isFlagged: false })
    .populate('listing', 'name slug')
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });
  success(res, reviews);
};

exports.approveReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!review) return error(res, 'Review not found', 404);
  success(res, {}, 'Review approved and live');
};

exports.rejectReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  success(res, {}, 'Review rejected and removed');
};

exports.getFlaggedReviews = async (req, res) => {
  const reviews = await Review.find({ isFlagged: true })
    .populate('listing', 'name slug')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  success(res, reviews);
};

exports.moderateReview = async (req, res) => {
  const { action } = req.body;
  if (action === 'approve') {
    await Review.findByIdAndUpdate(req.params.id, { isApproved: true, isFlagged: false });
    return success(res, {}, 'Review approved');
  }
  if (action === 'remove') {
    await Review.findByIdAndDelete(req.params.id);
    return success(res, {}, 'Review removed');
  }
  error(res, 'Invalid action', 400);
};
