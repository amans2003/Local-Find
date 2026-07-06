const mongoose = require('mongoose');
const slugify = require('slugify');

const timingSchema = new mongoose.Schema({
  day: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  open: String,
  close: String,
  isClosed: { type: Boolean, default: false },
}, { _id: false });

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    city: { type: String, required: true },
    subLocation: { type: String, default: '' },
    address: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    phone: [{ type: String }],
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    images: [{ type: String }],
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    timings: [timingSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    listedBy: {
      ref: { type: String, enum: ['User', 'Provider'], required: true },
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
    dynamicFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    views: { type: Number, default: 0 },
    phoneClicks: { type: Number, default: 0 },
    mapOpens: { type: Number, default: 0 },
  },
  { timestamps: true }
);

listingSchema.index({ coordinates: '2dsphere' });
listingSchema.index({ city: 1, category: 1, subCategory: 1, subLocation: 1, status: 1 });
listingSchema.index({ name: 'text', description: 'text', address: 'text' });

listingSchema.pre('save', async function (next) {
  if (this.isModified('name') || this.isNew) {
    const base = slugify(this.name, { lower: true, strict: true });
    const count = await mongoose.model('Listing').countDocuments({ slug: new RegExp(`^${base}`) });
    this.slug = count === 0 ? base : `${base}-${count}`;
  }
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
