const Tour = require('../models/tourmodels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    try {
        // 1) Get tour data from collection
        const tours = await Tour.find();

        
        res.status(200).render('overview', {
            title: 'All Tours',
            tours
        });
    } catch (err) {
        // Handle errors gracefully
        return next(new AppError('Error fetching tour data', 500)); // You can customize the error message and status code
    }
});
exports.getTour=catchAsync(async(req,res)=>{
    const tour = await Tour.findOne({ name: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
      });
      
   res.status(200).render('tour',{
       tiltle:'the Forest Hiker tour',
       tour

   })
})
