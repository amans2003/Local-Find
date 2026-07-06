const Review = require('../models/Review');
const Listing = require('../models/Listing');
const { success, error, paginated } = require('../utils/apiResponse');

exports.getListingReviews = async (req, res) => {
  const { listingId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const filter = { listing: listingId, isApproved: true };
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Review.countDocuments(filter),
  ]);
  paginated(res, reviews, total, page, limit);
};

exports.createReview = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing || listing.status !== 'active') return error(res, 'Listing not found', 404);

  const existing = await Review.findOne({ listing: listingId, user: req.user._id });
  if (existing) return error(res, 'You already reviewed this listing', 409);

  const review = await Review.create({
    listing: listingId,
    user: req.user._id,
    rating: req.body.rating,
    title: req.body.title,
    body: req.body.body,
  });
  await review.populate('user', 'name avatar');
  success(res, review, 'Review submitted', 201);
};

exports.updateReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) return error(res, 'Review not found', 404);
  const { rating, title, body } = req.body;
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (body) review.body = body;
  await review.save();
  success(res, review, 'Review updated');
};

exports.deleteReview = async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, user: req.user._id };
  const review = await Review.findOneAndDelete(filter);
  if (!review) return error(res, 'Review not found', 404);
  success(res, {}, 'Review deleted');
};

exports.flagReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isFlagged: true, flagReason: req.body.reason || '' },
    { new: true }
  );
  if (!review) return error(res, 'Review not found', 404);
  success(res, {}, 'Review flagged for moderation');
};
