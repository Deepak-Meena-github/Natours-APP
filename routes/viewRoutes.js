const express=require('express');
const viewController=require('./../controllers/viewsController');
const router=express.Router();
const authController=require('../controllers/authController');
const bookingController=require('../controllers/bookingController');

//  app.get('/', (req, res) => {
//  res.render('base'); // Renders the 'example.pug' template
//   });

  router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewController.getOverview);
  router.get('/tour/:slug',authController.isLoggedIn,authController.protect,viewController.getTour);
  router.get('/login',authController.isLoggedIn,viewController.getLoginForm);
  router.get('/me',authController.protect,viewController.getAccount);
  router.get('/my-tours', authController.protect, viewController.getMyTours);

  router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
  );
  //  /login 

  module.exports = router;