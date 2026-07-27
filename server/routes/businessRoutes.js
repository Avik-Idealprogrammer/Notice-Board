const express = require('express');
const {
  createBusiness,
  getBusiness,
  getMyBusiness,
  updateBusiness,
  listBusinesses,
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', listBusinesses);
router.get('/me', protect, authorize('business', 'admin'), getMyBusiness);
router.get('/:id', getBusiness);
router.post('/', protect, authorize('business', 'admin'), createBusiness);
router.put('/:id', protect, authorize('business', 'admin'), updateBusiness);

module.exports = router;
