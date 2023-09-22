const express = require('express');
const morgan = require('morgan');
const globalErrorHandler=require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError=require("./utils/appError")
const rateLimit=require("express-rate-limit") 
const helmet=require("helmet");
const mongoSanitize=require("express-mongo-sanitize");
const xss=require('xss-clean');
const { Mongoose } = require('mongoose');
const hpp=require("hpp");
const app = express();
const reviewRouter=require('./routes/reviewRoutes');
const path = require('path');


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// 1) MIDDLEWARES
// set security HTTP headers 
app.use(helmet())
// Devlopinging longing 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit requrest from api 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// body parser,reading data from body into req.body

app.use(express.json({limit:"10kb"}));
// data senatization against no sql query injection 

app.use(mongoSanitize());
// data senitizaton using xss
app.use(xss());
// prevent pramerter
app.use(hpp(
  {
    whitelist:[
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  }
))
// serving static files

// app.use(express.static(`${__dirname}/public`));
//   // test middleware 

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
 
  next();
});

// 3) ROUTES
app.use('/', (req, res) => {
  res.render('base'); // Renders the 'example.pug' template
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all(  "*",(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
app.use(globalErrorHandler);

module.exports = app;
