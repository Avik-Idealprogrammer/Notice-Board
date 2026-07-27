const express = require('express');
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
  getFeed,
} = require('../controllers/postController');
const {
  toggleLike,
  addComment,
  deleteComment,
  registerShare,
  toggleSave,
  getSavedPosts,
  reportPost,
} = require('../controllers/engagementController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// static/specific routes before dynamic :id routes
router.get('/mine', protect, getMyPosts);
router.get('/saved', protect, getSavedPosts);

router.post('/', protect, upload.array('images', 5), createPost);
router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.post('/:id/share', registerShare);
router.put('/:id/save', protect, toggleSave);
router.post('/:id/report', protect, reportPost);

module.exports = router;
