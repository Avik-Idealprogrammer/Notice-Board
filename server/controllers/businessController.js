const Business = require('../models/Business');

// POST /api/businesses  (role: business)
const createBusiness = async (req, res, next) => {
  try {
    const existing = await Business.findOne({ ownerId: req.user._id });
    if (existing) {
      return res.status(409).json({ message: 'You already have a business profile' });
    }

    const business = await Business.create({ ...req.body, ownerId: req.user._id });
    res.status(201).json(business);
  } catch (err) {
    next(err);
  }
};

// GET /api/businesses/:id
const getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id).populate('ownerId', 'name email');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    next(err);
  }
};

// GET /api/businesses/me
const getMyBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ ownerId: req.user._id });
    if (!business) return res.status(404).json({ message: 'No business profile yet' });
    res.json(business);
  } catch (err) {
    next(err);
  }
};

// PUT /api/businesses/:id  (owner or admin only)
const updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    if (String(business.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not your business profile' });
    }

    Object.assign(business, req.body);
    await business.save();
    res.json(business);
  } catch (err) {
    next(err);
  }
};

// GET /api/businesses?city=&category=
const listBusinesses = async (req, res, next) => {
  try {
    const { city, category } = req.query;
    const filter = {};
    if (city) filter['location.city'] = city;
    if (category) filter.category = category;

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    next(err);
  }
};

module.exports = { createBusiness, getBusiness, getMyBusiness, updateBusiness, listBusinesses };
