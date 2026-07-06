const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ listing: 1, user: 1 }, { unique: true });
reviewSchema.index({ listing: 1, isApproved: 1 });

reviewSchema.post('save', async function () {
  await updateListingRating(this.listing);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await updateListingRating(doc.listing);
});

async function updateListingRating(listingId) {
  const result = await mongoose.model('Review').aggregate([
    { $match: { listing: listingId, isApproved: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const avg = result[0]?.avg || 0;
  const count = result[0]?.count || 0;
  await mongoose.model('Listing').findByIdAndUpdate(listingId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

module.exports = mongoose.model('Review', reviewSchema);
