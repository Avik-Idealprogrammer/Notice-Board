const Post = require('../models/Post');
const Business = require('../models/Business');

// POST /api/posts   body: { type: 'ad'|'notice', title, description, category, location, eventDate? }
const createPost = async (req, res, next) => {
  try {
    const { type, title, description, category, location, eventDate } = req.body;

    if (!type || !title || !description || !category || !location) {
      return res.status(400).json({ message: 'Missing required post fields' });
    }

    let businessId = null;
    if (type === 'ad') {
      if (req.user.role !== 'business' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only business accounts can post ads' });
      }
      const business = await Business.findOne({ ownerId: req.user._id });
      if (!business) {
        return res.status(400).json({ message: 'Create a business profile before posting ads' });
      }
      businessId = business._id;
    }

    const images = (req.files || []).map((f) => f.path); // Cloudinary URL via multer-storage-cloudinary

    const post = await Post.create({
      type,
      ownerId: req.user._id,
      businessId,
      title,
      description,
      category,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      eventDate: type === 'notice' ? eventDate || null : null,
      images,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('ownerId', 'name')
      .populate('businessId', 'businessName category contact')
      .populate('comments.userId', 'name');

    if (!post || post.status === 'removed') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// PUT /api/posts/:id  (owner or admin only)
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not your post' });
    }

    const editable = ['title', 'description', 'category', 'location', 'eventDate'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id  (owner or admin only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not your post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/mine
const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// ---- Discovery / Feed engine ----
// GET /api/feed?city=&area=&category=&type=&q=&sort=recent|trending&page=&limit=
const getFeed = async (req, res, next) => {
  try {
    const { city, area, category, type, q, sort = 'recent', page = 1, limit = 12 } = req.query;

    const filter = { status: 'active' };
    if (city) filter['location.city'] = city;
    if (area) filter['location.area'] = area;
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (q) filter.$text = { $search: q };

    let query = Post.find(filter)
      .populate('ownerId', 'name')
      .populate('businessId', 'businessName category');

    if (sort === 'trending') {
      // trending = engagement-weighted, recent activity favored
      query = query.sort({ shareCount: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      query.skip(skip).limit(Number(limit)),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, getPost, updatePost, deletePost, getMyPosts, getFeed };
