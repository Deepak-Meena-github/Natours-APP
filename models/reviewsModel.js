// we want to review we want a /rating /created at / refrance /user who wrote this review and so with that stuff  we can learn it 
const mongoose = require('mongoose');
const Tour=require('./tourmodels');


const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
 reviewSchema.index({tour:1,user:1},{unique:true})

console.log('Middleware triggered for find query.');
reviewSchema.pre(/^find/,function(next){
    //  this.populate({
    //     path:"tour",
    //     select:"name"
    //  }).populate({
    //     path:"user",
    //     select:"name"
    //  })
    this.populate({
        path: 'user',
        select: 'name photo'
      });
    next()
})
  
// Import necessary modules and dependencies

// Define the static method on the schema
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // Use the aggregate method to calculate statistics
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, // Match reviews for a specific tour
    },
    {
      $group: {
        _id: '$tour', // Group by the tour ID
        nRatings: { $sum: 1 }, // Count the number of reviews
        avgRating: { $avg: '$rating' }, // Calculate the average rating
      },
    },
  ]);

  // Log the calculated statistics
  console.log(stats);
  if(stats.length>0){
await Tour.findByIdAndUpdate(tourId,{
  ratingsQuantity:stats[0].nRatings,
  ratingsAverage:stats[0].avgRating,
})
  }
  else {
    await Tour.findByIdAndUpdate(tourId,{
      ratingsQuantity:0,
      ratingsAverage:4.5
    })
  }
  // You can further use the stats data for other purposes, such as updating tour documents
  // or sending it as a response in an API endpoint.
};

reviewSchema.post('save',function(){
/// this points tto current reviews
this.constructor.calcAverageRatings(this.tour);

})
     //findByIdAndUpdate
     //findBYIdAndDelete
     reviewSchema.pre(/^findOneAnd/,async function (next){
       this.r=await this.findOne();
        console.log(this.r);
        next();
     })
     reviewSchema.post(/^findOneAnd/,async function (){
      // this.r=await this.findOne(); does not work here ,query has alerady excusted 
     await  this.r.constructor.calcAverageRatings(this.r.tour);
   })
    // we do here perants refrancing 
    // creating models
    const Review=mongoose.model('Review',reviewSchema);


    module.exports= Review;
    //assignment 2 i want to implement both these end poitn one end point for for getting end reviews and for creating new reviews.
    //steps 
    // 1 create conrtoller files //
    // 2 then create controller functions 
    // now create the routes and in review routes 
    // create some new reviews 

