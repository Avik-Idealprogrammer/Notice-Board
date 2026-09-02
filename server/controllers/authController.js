const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth: firebaseAuthInstance } = require('../config/firebase');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/firebase  (Google sign-in AND Phone OTP both land here)
const firebaseAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken is required' });

    const decoded = await firebaseAuthInstance.verifyIdToken(idToken);
    const { uid, email, name, phone_number } = decoded;

    // Match an existing user by whichever identifier this login provided
    let user = null;
    if (email) user = await User.findOne({ email });
    if (!user && phone_number) user = await User.findOne({ phone: phone_number });
    if (!user) user = await User.findOne({ googleId: uid });

    if (!user) {
      user = await User.create({
        name: name || (email ? email.split('@')[0] : `user_${uid.slice(0, 6)}`),
        email: email || `${uid}@phoneuser.noticeboard`, // placeholder, email is required+unique in schema
        googleId: email ? uid : undefined,
        phone: phone_number || undefined,
      });
    } else {
      // Backfill identifiers if this is the first time logging in via this method
      if (email && !user.googleId) user.googleId = uid;
      if (phone_number && !user.phone) user.phone = phone_number;
      await user.save();
    }

    if (user.isBanned) return res.status(403).json({ message: 'Account is banned' });

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, city, area } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'business' ? 'business' : 'user', // admin is never self-assigned
      location: { city: city || '', area: area || '' },
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.isBanned) return res.status(403).json({ message: 'Account is banned' });

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe, firebaseAuth };