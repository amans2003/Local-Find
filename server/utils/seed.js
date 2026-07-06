require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const City = require('../models/City');

const categories = [
  { name: 'Education', subCategories: [{ name: 'School', slug: 'school' }, { name: 'College', slug: 'college' }, { name: 'Coaching', slug: 'coaching' }, { name: 'Tuition', slug: 'tuition' }, { name: 'University', slug: 'university' }] },
  { name: 'Healthcare', subCategories: [{ name: 'Hospital', slug: 'hospital' }, { name: 'Clinic', slug: 'clinic' }, { name: 'Diagnostic Lab', slug: 'diagnostic-lab' }, { name: 'Pharmacy', slug: 'pharmacy' }] },
  { name: 'Legal', subCategories: [{ name: 'Advocate', slug: 'advocate' }, { name: 'Law Firm', slug: 'law-firm' }, { name: 'Notary', slug: 'notary' }] },
  { name: 'Finance', subCategories: [{ name: 'Bank', slug: 'bank' }, { name: 'ATM', slug: 'atm' }, { name: 'CA Firm', slug: 'ca-firm' }] },
  { name: 'Real Estate', subCategories: [{ name: 'Property Agent', slug: 'property-agent' }, { name: 'Builder', slug: 'builder' }, { name: 'PG/Hostel', slug: 'pg-hostel' }] },
  { name: 'Restaurants', subCategories: [{ name: 'Restaurant', slug: 'restaurant' }, { name: 'Cafe', slug: 'cafe' }, { name: 'Dhaba', slug: 'dhaba' }] },
  { name: 'Retail', subCategories: [{ name: 'Electronics', slug: 'electronics' }, { name: 'Clothing', slug: 'clothing' }, { name: 'Grocery', slug: 'grocery' }] },
  { name: 'Services', subCategories: [{ name: 'Plumber', slug: 'plumber' }, { name: 'Electrician', slug: 'electrician' }, { name: 'Salon', slug: 'salon' }] },
  { name: 'Government', subCategories: [{ name: 'Police Station', slug: 'police-station' }, { name: 'Municipality', slug: 'municipality' }, { name: 'RTO', slug: 'rto' }] },
  { name: 'Religious', subCategories: [{ name: 'Temple', slug: 'temple' }, { name: 'Mosque', slug: 'mosque' }, { name: 'Church', slug: 'church' }, { name: 'Gurudwara', slug: 'gurudwara' }] },
];

const cities = [
  { name: 'Delhi', state: 'Delhi', subLocations: ['Dwarka', 'Rohini', 'Connaught Place', 'Lajpat Nagar', 'Karol Bagh', 'Saket', 'Noida Extension'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s/g, '-') })) },
  { name: 'Mumbai', state: 'Maharashtra', subLocations: ['Andheri', 'Bandra', 'Juhu', 'Dadar', 'Thane'].map((n) => ({ name: n, slug: n.toLowerCase() })) },
  { name: 'Bangalore', state: 'Karnataka', subLocations: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s/g, '-') })) },
  { name: 'Hyderabad', state: 'Telangana', subLocations: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s/g, '-') })) },
  { name: 'Chennai', state: 'Tamil Nadu', subLocations: ['Anna Nagar', 'T. Nagar', 'Velachery', 'OMR'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/[\s.]/g, '-') })) },
  { name: 'Kolkata', state: 'West Bengal', subLocations: ['Salt Lake', 'Park Street', 'Howrah', 'New Town'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s/g, '-') })) },
  { name: 'Pune', state: 'Maharashtra', subLocations: ['Koregaon Park', 'Baner', 'Hinjewadi', 'Wakad'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s/g, '-') })) },
  { name: 'Jaipur', state: 'Rajasthan', subLocations: ['Malviya Nagar', 'Vaishali Nagar', 'C Scheme', 'Mansarovar'].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s/g, '-') })) },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'localfind' });
  console.log('Connected to MongoDB');

  await Category.deleteMany({});
  for (const cat of categories) {
    await Category.create({ name: cat.name, subCategories: cat.subCategories });
  }
  console.log(`Seeded ${categories.length} categories`);

  await City.deleteMany({});
  for (const city of cities) {
    await City.create(city);
  }
  console.log(`Seeded ${cities.length} cities`);

  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@localfind.in',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'Admin@1234!',
      role: 'admin',
      isVerified: true,
    });
    console.log('Admin user created');
  } else {
    console.log('Admin already exists');
  }

  await mongoose.disconnect();
  console.log('Seed complete!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
