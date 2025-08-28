var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors=require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var subcategoryRouter = require('./routes/subcategory');
var brandRouter = require('./routes/brand');
var productRouter = require('./routes/product');
var productdetailRouter = require('./routes/productdetail');
var productpicturesRouter = require('./routes/productpictures');
var mainbannerRouter = require('./routes/mainbanner');
var bankofferRouter = require('./routes/bankoffer');
var adminloginRouter = require('./routes/adminlogin');
var adoffersRouter = require('./routes/adoffers');
var userInterfaceRouter = require('./routes/userinterface');
var smsapiRouter = require('./routes/smsapi');





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/brand', brandRouter);
app.use('/product', productRouter);
app.use('/productdetail', productdetailRouter);
app.use('/productpictures', productpicturesRouter);
app.use('/mainbanner', mainbannerRouter);
app.use('/bankoffer',bankofferRouter);
app.use('/adminlogin', adminloginRouter);
app.use('/adoffers', adoffersRouter);
app.use('/userinterface',userInterfaceRouter);
app.use('/smsapi',smsapiRouter);














// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
