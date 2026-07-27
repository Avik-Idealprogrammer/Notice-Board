const express = require('express');
const { getFeed } = require('../controllers/postController');

const router = express.Router();

router.get('/', getFeed);

module.exports = router;
