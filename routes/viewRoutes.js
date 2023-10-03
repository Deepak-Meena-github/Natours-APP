const express=require('express');
const viewController=require('./../controllers/viewsController');
const router=express.Router();
const authController=require('../controllers/authController');
//  app.get('/', (req, res) => {
//  res.render('base'); // Renders the 'example.pug' template
//   });
router.get('/', authController.isLoggedIn)
  router.get('/',viewController.getOverview);
  router.get('/tour/:slug',viewController.getTour);
  router.get('/login',viewController.getLoginForm);
  //  /login 

  module.exports = router;