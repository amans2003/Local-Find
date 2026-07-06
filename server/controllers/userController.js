const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const { success, error } = require('../utils/apiResponse');

exports.getProfile = async (req, res) => {
  success(res, req.user.toPublicJSON());
};

exports.updateProfile = async (req, res) => {
  const allowed = ['name', 'phone', 'avatar'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  success(res, user.toPublicJSON(), 'Profile updated');
};

exports.getBookmarks = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'bookmarks',
    match: { isActive: true },
    select: 'name slug city category subCategory rating images logo',
  });
  success(res, user.bookmarks);
};

exports.toggleBookmark = async (req, res) => {
  const { listingId } = req.params;
  const user = req.user;
  const isBookmarked = user.bookmarks.includes(listingId);

  if (isBookmarked) {
    await User.findByIdAndUpdate(user._id, { $pull: { bookmarks: listingId } });
    return success(res, { bookmarked: false }, 'Removed from bookmarks');
  }
  await User.findByIdAndUpdate(user._id, { $addToSet: { bookmarks: listingId } });
  success(res, { bookmarked: true }, 'Added to bookmarks');
};

exports.getMyReviews = async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('listing', 'name slug city category')
    .sort({ createdAt: -1 });
  success(res, reviews);
};
