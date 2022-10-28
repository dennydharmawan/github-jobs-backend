const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validations.js');
const User = require('../models/UserModel');
const authenticateUser = require('./verifyToken.js');
const createError = require('http-errors');

// Routers
router.post('/register', async (req, res, next) => {
  try {
    // Validation check
    const { error } = registerValidation(req.body);
    if (error) return next(createError.BadRequest(error.details[0].message));

    // Email uniqueness check
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists)
      return next(
        createError.BadRequest('Email address is already registered')
      );

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Save user
    const user = User({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword
    });

    const newUser = await user.save();
    res.send({ user: newUser._id });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    // Validation check
    const { error } = loginValidation(req.body);
    if (error) return next(createError.BadRequest(error.details[0].message));

    // Email existance check
    const registeredUser = await User.findOne({ email: req.body.email });
    if (!registeredUser)
      return next(createError.BadRequest('Email or Password does not match'));

    // Check password
    const passwordMatch = bcrypt.compareSync(
      req.body.password,
      registeredUser.password
    );
    if (!passwordMatch)
      return next(createError.BadRequest('Email or Password does not match'));

    // Create and assign JWT
    const token = jwt.sign({ _id: registeredUser._id }, process.env.JWT_SECRET);

    //https://old.reddit.com/r/node/comments/mvrezq/cookie_security_samesite_question_deployment/
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(204);

  res.clearCookie('token', { httpOnly: true });

  return res.sendStatus(200);
});

router.post('/authenticate', (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.send({
      isAuthenticated: false
    });

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.send({ isAuthenticated: true, ...verifiedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
