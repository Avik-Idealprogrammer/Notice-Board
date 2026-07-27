const User = require('../models/User');
const Business = require('../models/Business');
const Post = require('../models/Post');
const Report = require('../models/Report');

// GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [userCount, businessCount, adCount, noticeCount, pendingReports, activePosts] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Business.countDocuments(),
        Post.countDocuments({ type: 'ad' }),
        Post.countDocuments({ type: 'notice' }),
        Report.countDocuments({ status: 'pending' }),
        Post.countDocuments({ status: 'active' }),
      ]);

    res.json({ userCount, businessCount, adCount, noticeCount, pendingReports, activePosts });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/ban  (toggles ban)
const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban an admin' });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ isBanned: user.isBanned });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reports?status=pending
const listReports = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;
    const reports = await Report.find({ status })
      .populate('postId')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/reports/:id/resolve  body: { action: 'restore'|'remove' }
const resolveReport = async (req, res, next) => {
  try {
    const { action } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const post = await Post.findById(report.postId);
    if (post) {
      post.status = action === 'remove' ? 'removed' : 'active';
      await post.save();
    }

    report.status = 'reviewed';
    await report.save();

    res.json({ message: `Report resolved: ${action}` });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/posts?status=
const listAllPosts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const posts = await Post.find(filter)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, listUsers, toggleBanUser, listReports, resolveReport, listAllPosts };
