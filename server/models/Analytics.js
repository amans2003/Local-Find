const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    date: { type: String, required: true },
    views: { type: Number, default: 0 },
    phoneClicks: { type: Number, default: 0 },
    mapOpens: { type: Number, default: 0 },
  },
  { timestamps: false }
);

analyticsSchema.index({ listing: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
