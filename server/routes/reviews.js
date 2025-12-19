const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createReview, getProviderReviews, getMyReviews } = require('../controllers/reviewController');
router.post('/', auth, createReview);
router.get('/provider/:providerId', getProviderReviews);
router.get('/my-reviews', auth, getMyReviews);
module.exports = router;
