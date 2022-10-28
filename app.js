const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

require('dotenv/config'); // Environment variables

// Route imports
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');

// process.env.CORS_ALLOWED_ORIGINS = 'https://ghj.dennydharmawan.com';

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());

// -> Route Middlewares
app.use('/', homeRoutes);
app.use('/api/users', authRoutes);
app.use('/api/jobs', jobRoutes);

// error handling
// https://reflectoring.io/express-error-handling/
// https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'

  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

// Connect to Database
mongoose.connect(process.env.DB_URL, () => {
  console.log('Connected to Database');
});

// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Application running at http://localhost:${process.env.PORT}/`);
});
