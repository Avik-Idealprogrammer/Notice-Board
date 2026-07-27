const Post = require('../models/Post');
const Report = require('../models/Report');
const User = require('../models/User');

// PUT /api/posts/:id/like  (toggles)
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const hasLiked = post.likes.some((id) => String(id) === String(userId));

    if (hasLiked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ liked: !hasLiked, likeCount: post.likes.length });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/comments  body: { text }
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ userId: req.user._id, text: text.trim() });
    await post.save();

    const updated = await Post.findById(post._id).populate('comments.userId', 'name');
    res.status(201).json(updated.comments);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id/comments/:commentId  (comment author or admin)
const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (String(comment.userId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not your comment' });
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/share  (increments a counter, e.g. hit when user copies/share-link)
const registerShare = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ shareCount: post.shareCount });
  } catch (err) {
    next(err);
  }
};

// PUT /api/posts/:id/save  (toggles save on the user's account)
const toggleSave = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;
    const isSaved = user.savedPosts.some((id) => String(id) === String(postId));

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter((id) => String(id) !== String(postId));
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();
    res.json({ saved: !isSaved });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/saved
const getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'businessId', select: 'businessName category' },
    });
    res.json(user.savedPosts);
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/report  body: { reason }
const reportPost = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ message: 'Reason required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await Report.create({ postId: post._id, reportedBy: req.user._id, reason: reason.trim() });
    post.status = 'reported';
    await post.save();

    res.status(201).json({ message: 'Post reported, pending review' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toggleLike,
  addComment,
  deleteComment,
  registerShare,
  toggleSave,
  getSavedPosts,
  reportPost,
};
