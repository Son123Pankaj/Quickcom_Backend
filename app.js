require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var { Kafka } = require('kafkajs');

// Database Connection Import
var pool = require('./routes/pool');

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
app.use(cors());
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
app.use('/bankoffer', bankofferRouter);
app.use('/adminlogin', adminloginRouter);
app.use('/adoffers', adoffersRouter);
app.use('/userinterface', userInterfaceRouter);
app.use('/smsapi', smsapiRouter);

// ==========================================
// 🚀 KAFKA TO MYSQL INTEGRATION
// ==========================================
const caCertPath = path.join(__dirname, 'ca.pem');

// SSL CA Certificate (फाइल से या ENV वैरिएबल से)
let caCert = null;
if (fs.existsSync(caCertPath)) {
  caCert = fs.readFileSync(caCertPath, 'utf-8');
} else if (process.env.KAFKA_CA_CERT) {
  caCert = process.env.KAFKA_CA_CERT;
}

if (caCert) {
  const kafka = new Kafka({
    clientId: 'quickcom-backend',
    brokers: [process.env.KAFKA_BROKER || 'quickcomdata-bus-v1-pankaj-fc18.d.aivencloud.com:24694'],
    ssl: {
      rejectUnauthorized: true,
      ca: [caCert],
    },
    sasl: {
      mechanism: 'scram-sha-256',
      username: process.env.KAFKA_USER || 'avnadmin',
      password: process.env.KAFKA_PASSWORD,
    },
  });

  const consumer = kafka.consumer({ groupId: 'quickcom-group' });

  const startKafka = async () => {
    try {
      await consumer.connect();
      console.log('✅ Connected to Aiven Kafka Service!');

      await consumer.subscribe({ topic: 'user_activity_data_gen', fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const rawString = message.value.toString();
            const data = JSON.parse(rawString);

            console.log('📥 Live Stream Data Received:', data);

            // MySQL Table में Data Insert करें
            const query = `
              INSERT INTO user_activities (action, action_id, country_code, raw_data) 
              VALUES (?, ?, ?, ?)
            `;
            const values = [
              data.action || null, 
              data.action_id || null, 
              data.country_code || null, 
              rawString
            ];

            pool.query(query, values, (dbErr, result) => {
              if (dbErr) {
                console.error('❌ Database Insert Error:', dbErr.message);
              } else {
                console.log('💾 Data successfully saved to MySQL! ID:', result.insertId);
              }
            });

          } catch (e) {
            console.error('JSON Parse Error:', e.message);
          }
        },
      });
    } catch (err) {
      console.error('❌ Kafka Connection Error:', err.message);
    }
  };

  startKafka();
} else {
  console.warn('⚠️ SSL Certificate (ca.pem या KAFKA_CA_CERT) नहीं मिला! Kafka चालू नहीं हुआ।');
}
// ==========================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;