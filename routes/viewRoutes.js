const express=require('express');
const viewController=require('./../controllers/viewsController');
const router=express.Router();
//  app.get('/', (req, res) => {
//  res.render('base'); // Renders the 'example.pug' template
//   });
  router.get('/',viewController.getOverview);
  router.get('/tour/:slug',viewController.getTour)
  module.exports = router;