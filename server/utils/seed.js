require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Business = require('../models/Business');
const Post = require('../models/Post');

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Business.deleteMany({}), Post.deleteMany({})]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@noticeboard.local',
    password: 'admin1234',
    role: 'admin',
    location: { city: 'Gorakhpur', area: 'Civil Lines' },
  });

  const resident = await User.create({
    name: 'Ritika Sharma',
    email: 'ritika@example.com',
    password: 'password123',
    role: 'user',
    location: { city: 'Gorakhpur', area: 'Civil Lines' },
  });

  const bizOwner1 = await User.create({
    name: 'Anil Kumar',
    email: 'anil@primetailors.local',
    password: 'password123',
    role: 'business',
    location: { city: 'Gorakhpur', area: 'Golghar' },
  });

  const bizOwner2 = await User.create({
    name: 'Sunita Verma',
    email: 'sunita@greenleafcafe.local',
    password: 'password123',
    role: 'business',
    location: { city: 'Gorakhpur', area: 'Betiahata' },
  });

  console.log('Creating business profiles...');
  const business1 = await Business.create({
    ownerId: bizOwner1._id,
    businessName: 'Prime Tailors',
    category: 'services',
    description: 'Custom stitching and alterations, established 1999.',
    location: { city: 'Gorakhpur', area: 'Golghar' },
    contact: { phone: '9876543210', email: 'anil@primetailors.local' },
  });

  const business2 = await Business.create({
    ownerId: bizOwner2._id,
    businessName: 'Green Leaf Cafe',
    category: 'food',
    description: 'Cozy neighborhood cafe serving coffee, snacks, and breakfast.',
    location: { city: 'Gorakhpur', area: 'Betiahata' },
    contact: { phone: '9876500000', email: 'sunita@greenleafcafe.local' },
  });

  console.log('Creating ads...');
  await Post.create([
    {
      type: 'ad',
      ownerId: bizOwner1._id,
      businessId: business1._id,
      title: '20% Off on Festive Season Stitching',
      description: 'Get your ethnic wear stitched at a discount this festive season. Book now.',
      category: 'sale',
      location: { city: 'Gorakhpur', area: 'Golghar' },
      images: [],
    },
    {
      type: 'ad',
      ownerId: bizOwner2._id,
      businessId: business2._id,
      title: 'New Breakfast Menu Launched',
      description: 'Try our new South Indian breakfast combo, available 7-11 AM daily.',
      category: 'announcement',
      location: { city: 'Gorakhpur', area: 'Betiahata' },
      images: [],
    },
  ]);

  console.log('Creating community notices...');
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  await Post.create([
    {
      type: 'notice',
      ownerId: resident._id,
      title: 'Society Blood Donation Camp',
      description: 'Blood donation camp organized at the community hall this weekend. All welcome.',
      category: 'event',
      location: { city: 'Gorakhpur', area: 'Civil Lines' },
      eventDate: nextWeek,
      images: [],
    },
    {
      type: 'notice',
      ownerId: resident._id,
      title: 'Water Supply Disruption Notice',
      description: 'Water supply will be disrupted in Civil Lines area on Sunday for maintenance work.',
      category: 'alert',
      location: { city: 'Gorakhpur', area: 'Civil Lines' },
      images: [],
    },
    {
      type: 'notice',
      ownerId: resident._id,
      title: 'Part-time Tutor Needed',
      description: 'Looking for a part-time math tutor for a class 10 student, evenings only.',
      category: 'job',
      location: { city: 'Gorakhpur', area: 'Betiahata' },
      images: [],
    },
  ]);

  console.log('Seed complete.');
  console.log(`Admin login: admin@noticeboard.local / admin1234`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
