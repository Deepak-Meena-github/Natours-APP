const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({mergeParams: true});

// Uncomment this line to protect the route
// router.use(authController.protect);
router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews) // Corrected function name from geAllReviews to getAllReviews
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview // Corrected function name from creatReview to createReview
  );
router.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user','admin'),reviewController.updateReview)
.delete(authController.restrictTo('user','admin'),reviewController.deleteReview);
module.exports = router;
