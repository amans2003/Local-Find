const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    state: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    subLocations: [
      {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

citySchema.pre('save', function (next) {
  if (this.isModified('name') || this.isModified('state')) {
    this.slug = slugify(`${this.name}-${this.state}`, { lower: true, strict: true });
  }
  if (this.isModified('subLocations')) {
    this.subLocations = this.subLocations.map((sl) => ({
      ...sl,
      slug: sl.slug || slugify(sl.name, { lower: true, strict: true }),
    }));
  }
  next();
});

module.exports = mongoose.model('City', citySchema);
