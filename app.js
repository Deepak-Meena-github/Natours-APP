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
const cookieParser=require('cookie-parser');
const app = express();
const reviewRouter=require('./routes/reviewRoutes');
const viewRouter=require('./routes/viewRoutes');
const bookingRouter=require('./routes/bookingsRoutes');
const bookingController = require('./controllers/bookingController');


const path = require('path');



app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// 1) MIDDLEWARES
// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://127.0.0.1:*/',
 
        ],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// app.use(helmet())
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
app.use(express.urlencoded({extended:true,limit:'10kb'}));
app.use(cookieParser());
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
  //console.log(req.cookies,"token h tu");

 
  next();
});

// 3) ROUTES
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all(  "*",(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
app.use(globalErrorHandler);

module.exports = app;
