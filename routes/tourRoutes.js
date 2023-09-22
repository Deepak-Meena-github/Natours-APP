const express = require('express');
const tourController = require('./../controllers/tourController');
const { protect,restrictTo } = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');


const router = express.Router();

// router.param('id', tourController.checkID);
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
router.use('/:tourId/reviews', reviewRouter);


router.route('/top-5-cheap')
       .get(tourController.aliasTopTours,tourController.getAllTours)

       router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(protect,restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithIn)
// tours-distance?distance=233&center=-40,45&unti=mi
// tours-distance/233/center/-40,45/unit/mi
// /distances/34.111745,-118.113491/unit/:unit
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(protect,restrictTo('admin','lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(protect,restrictTo('admin','lead-guide'),tourController.updateTour)
  .delete(protect,restrictTo('admin','lead-guide'),tourController.deleteTour);

  // router.route('/:tourId/reviews').post( protect,restrictTo('user'),
  // reviewController.createReview)

module.exports = router;
