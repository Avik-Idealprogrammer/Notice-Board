const express = require('express');
const {
  getAnalytics,
  listUsers,
  toggleBanUser,
  listReports,
  resolveReport,
  listAllPosts,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin')); // every route below is admin-only

router.get('/analytics', getAnalytics);
router.get('/users', listUsers);
router.put('/users/:id/ban', toggleBanUser);
router.get('/reports', listReports);
router.put('/reports/:id/resolve', resolveReport);
router.get('/posts', listAllPosts);

module.exports = router;
