const Listing = require('../models/Listing');
const Analytics = require('../models/Analytics');
const { success, error, paginated } = require('../utils/apiResponse');
const { del, delPattern } = require('../services/cacheService');

exports.getMyListings = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { 'listedBy.id': req.provider._id, 'listedBy.ref': 'Provider' };
  if (status) filter.status = status;

  const [listings, total] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
    Listing.countDocuments(filter),
  ]);
  paginated(res, listings, total, page, limit);
};

exports.getListingAnalytics = async (req, res) => {
  const { id } = req.params;
  const { days = 30 } = req.query;

  const listing = await Listing.findOne({ _id: id, 'listedBy.id': req.provider._id });
  if (!listing) return error(res, 'Listing not found', 404);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - Number(days));
  const fromStr = fromDate.toISOString().split('T')[0];

  const analytics = await Analytics.find({
    listing: id,
    date: { $gte: fromStr },
  }).sort({ date: 1 }).lean();

  success(res, {
    listing: { id: listing._id, name: listing.name, views: listing.views, phoneClicks: listing.phoneClicks, mapOpens: listing.mapOpens },
    daily: analytics,
  });
};

exports.uploadListingImages = async (req, res) => {
  if (!req.files || !req.files.length) return error(res, 'No files uploaded', 400);
  const BASE = `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map((f) => {
    // Convert absolute disk path → /uploads/folder/filename URL
    const rel = f.path.replace(/\\/g, '/').split('/uploads/')[1];
    return `${BASE}/uploads/${rel}`;
  });
  success(res, { urls }, 'Images uploaded');
};
