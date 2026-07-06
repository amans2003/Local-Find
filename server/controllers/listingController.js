const Listing = require('../models/Listing');
const Analytics = require('../models/Analytics');
const { success, error, paginated } = require('../utils/apiResponse');
const { get, set, del, delPattern, SEARCH_TTL, LISTING_TTL } = require('../services/cacheService');

const todayStr = () => new Date().toISOString().split('T')[0];

// Builds a safe case-insensitive regex where hyphens and spaces are interchangeable.
// Escapes all regex special chars first to prevent ReDoS.
// e.g. "patel-nagar" matches "Patel Nagar", "patel-nagar", "Patel-Nagar"
const fieldRegex = (val) => {
  const escaped = val.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = escaped.replace(/[-\s]+/g, '[\\s\\-]+');
  return new RegExp(`^${pattern}$`, 'i');
};

exports.searchListings = async (req, res) => {
  const { city, category, subCategory, subLocation, q, page = 1, limit = 12, sort = 'rating', isVerified, minRating } = req.query;

  const cacheKey = `search:${JSON.stringify(req.query)}`;
  const cached = await get(cacheKey);
  if (cached) return res.status(200).json(cached);

  const filter = { status: 'active', isActive: true };
  if (city)                 filter.city        = fieldRegex(city);
  if (category)             filter.category    = fieldRegex(category);
  if (subCategory)          filter.subCategory = fieldRegex(subCategory);
  if (subLocation)          filter.subLocation = fieldRegex(subLocation);
  if (q)                    filter.$text       = { $search: q };
  if (isVerified === 'true') filter.isVerified = true;
  if (minRating)            filter.rating      = { $gte: Number(minRating) };

  const sortMap = { rating: { rating: -1 }, newest: { createdAt: -1 }, name: { name: 1 } };
  const sortBy = sortMap[sort] || sortMap.rating;

  const skip = (page - 1) * limit;
  const [listings, total] = await Promise.all([
    Listing.find(filter).sort(sortBy).skip(skip).limit(Number(limit)).lean(),
    Listing.countDocuments(filter),
  ]);

  const responseData = { success: true, message: 'Success', data: listings, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) } };
  await set(cacheKey, responseData, SEARCH_TTL);
  res.status(200).json(responseData);
};

exports.getListingBySlug = async (req, res) => {
  const { slug } = req.params;
  const cacheKey = `listing:${slug}`;
  const cached = await get(cacheKey);
  if (cached) {
    trackView(cached.data._id);
    return res.status(200).json(cached);
  }

  const listing = await Listing.findOne({ slug, status: 'active', isActive: true }).lean();
  if (!listing) return error(res, 'Listing not found', 404);

  const responseData = { success: true, message: 'Success', data: listing };
  await set(cacheKey, responseData, LISTING_TTL);
  trackView(listing._id);
  res.status(200).json(responseData);
};

exports.getNearbyListings = async (req, res) => {
  const { lng, lat, radius = 5000, limit = 10 } = req.query;
  if (!lng || !lat) return error(res, 'lng and lat are required', 400);

  const listings = await Listing.find({
    status: 'active',
    isActive: true,
    coordinates: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: Number(radius),
      },
    },
  }).limit(Number(limit)).lean();

  success(res, listings);
};

exports.trackPhoneClick = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { $inc: { phoneClicks: 1 } });
  await Analytics.findOneAndUpdate(
    { listing: id, date: todayStr() },
    { $inc: { phoneClicks: 1 } },
    { upsert: true }
  );
  success(res, {});
};

exports.trackMapOpen = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { $inc: { mapOpens: 1 } });
  await Analytics.findOneAndUpdate(
    { listing: id, date: todayStr() },
    { $inc: { mapOpens: 1 } },
    { upsert: true }
  );
  success(res, {});
};

async function trackView(listingId) {
  await Listing.findByIdAndUpdate(listingId, { $inc: { views: 1 } });
  await Analytics.findOneAndUpdate(
    { listing: listingId, date: todayStr() },
    { $inc: { views: 1 } },
    { upsert: true }
  );
}

exports.createListing = async (req, res) => {
  const isProvider = !!req.provider;
  const listing = await Listing.create({
    ...req.body,
    status: 'pending',
    isActive: false,
    listedBy: {
      ref: isProvider ? 'Provider' : 'User',
      id: isProvider ? req.provider._id : req.user._id,
    },
  });

  if (isProvider) {
    const Provider = require('../models/Provider');
    await Provider.findByIdAndUpdate(req.provider._id, { $push: { listings: listing._id } });
  }

  await delPattern('search:*');
  success(res, listing, 'Listing submitted for review', 201);
};

exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return error(res, 'Listing not found', 404);

  const isOwner = req.provider
    ? listing.listedBy.id.toString() === req.provider._id.toString()
    : listing.listedBy.id.toString() === req.user._id.toString();

  if (!isOwner && req.user?.role !== 'admin') return error(res, 'Not authorized', 403);

  const updated = await Listing.findByIdAndUpdate(
    id,
    { ...req.body, status: req.user?.role === 'admin' ? req.body.status : 'pending' },
    { new: true, runValidators: true }
  );

  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, updated, 'Listing updated');
};

exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return error(res, 'Listing not found', 404);

  const isOwner = req.provider
    ? listing.listedBy.id.toString() === req.provider._id.toString()
    : false;

  if (!isOwner && req.user?.role !== 'admin') return error(res, 'Not authorized', 403);

  listing.isActive = false;
  listing.status = 'draft';
  await listing.save();
  await del(`listing:${listing.slug}`);
  await delPattern('search:*');
  success(res, {}, 'Listing deactivated');
};
