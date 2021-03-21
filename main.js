const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const log = require('./log');
const router = express.Router();


require('dotenv').config();

const app = express();

var fileupload = require("express-fileupload");
app.use(fileupload());

// Mongoose
mongoose.connect(process.env.MONGO_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => log.log('MongoDB', 'Connected'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const whitelist = ['http://localhost:3000'];
const corsOptions = {
   origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== 1) {
         callback(null, true);
      } else callback(new Error('Not allowed by CORS'));
   },
   credentials: true,
};
app.use(cors(corsOptions));

// Session Management
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
   })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes
app.use('/user', require('./routes/userRoute'));
app.use('/hospital', require('./routes/hospitalRoute'));
app.use('/bed', require('./routes/bedRoute'));
app.use('/booking', require('./routes/bookingRoute'));
app.use('/', require('./routes/firebaseRoute'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => log.log('Server', `Running on port ${PORT}`));