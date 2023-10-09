const authController = require('express').Router();
const { body, validationResult } = require('express-validator');

const { register, login } = require('../services/userService');
const { authHeaderSetter } = require('../utils/authHeaderSetter');
const { countriesList, PASSWORD_REGEXP } = require('../utils/assets');
const errorParser = require('../utils/errorParser');
const User = require('../models/User');
const { isGuest, hasUser } = require('../middlewares/guards');
const Util = require('../models/Util');


authController.post('/register', isGuest(),
  body('email').isEmail().withMessage('Invalid email!'),
  body('password').custom(value => {
    const match = PASSWORD_REGEXP.test(value);
    if (match) {
      return true;
    }
    throw new Error('Password has invalid format!');
  }),
  body('username').isLength({ min: 5, max: 20 }).withMessage('The password must be between 5 and 20 characters long!'),
  body('country').isIn(countriesList).withMessage('Incorrect Country!'),
  body('gender').isIn(['M', 'W', 'unknown']).withMessage('Incorrect Gender!'),
  async (req, res) => {
    try {
      console.log('>>> POST /users/register');

      const { errors } = validationResult(req);

      if (errors.length > 0) {
        throw errors;
      }

      const util = await Util.findById('6523f20a83b3557fd90806a8');
      console.log(util);

      const currentGusetNumber = util.guestNumber.toString();

      const accountName = 'Guest' + (currentGusetNumber.length < 8 ? '0'.repeat(8 - currentGusetNumber.length) + currentGusetNumber : currentGusetNumber);

      const token = await register(req.body.email, req.body.username, req.body.password, req.body.country, req.body.gender, accountName);

      util.guestNumber++;
      await util.save();


      authHeaderSetter(res, token);
      res.json(token);
    } catch (err) {
      const error = errorParser(err);
      console.log('>>> ERROR');
      console.log(`>>> ${error}`);

      res.status(409).json({
        errors: error
      });
    }
  });

authController.post('/login',
  body('email').isEmail().withMessage('Invalid email or password!'),
  body('password').isLength({ min: 1 }).withMessage('Invalid email or password!'),
  async (req, res) => {
    try {
      console.log('>>> POST /users/login');

      const { errors } = validationResult(req);

      if (errors.length > 0) {
        throw errors;
      }

      const token = await login(req.body.email, req.body.password,);
      authHeaderSetter(res, token);
      res.json(token);
    } catch (err) {
      const error = errorParser(err);

      console.log('>>> ERROR');
      console.log(`>>> ${error}`);

      res.status(401).json({
        errors: error
      });
    }
  });

authController.use('/logout', hasUser(), async (req, res) => {
  console.log('>>> USE /users/logout');

  const token = req.token || '';
  authHeaderSetter(res, token, 'logout');
  res.status(204).end();
});

authController.get('/user', async (req, res) => {
  try {
    console.log('>>> GET /users/user');

    const userId = req.user._id;

    const user = await User.findById(userId);

    const { email, username, country, gender, accountName } = user;

    res.json({ email, username, country, gender, _id: userId, accountName });
  } catch (err) {
    res.json(undefined);
  }
});

authController.put('/user', hasUser(), async (req, res) => {
  try {
    console.log('>>> PUT /users/user');

    const newEmail = req.body.email;
    const newUsername = req.body.username;
    const newCountry = req.body.country;
    const newGender = req.body.gender;
    const newAccountName = req.body.accountName;

    const userId = req.user._id;

    const [bodyUser, user] = await Promise.all([User.findOne({ email: newEmail }), User.findById(userId)]);

    const bodyUserId = bodyUser._id;
    const userrId = user._id;


    if (!bodyUserId.equals(userrId)) {
      throw new Error('You can update only your own account!');
    }

    throw new Error('You can update only your own account!');

    const { email, username, country, gender, accountName } = user;

    res.json({ email, username, country, gender, _id: userId, accountName });
  } catch (err) {
    const error = errorParser(err);
    console.log('>>> ERROR');
    console.log(`>>> ${error}`);

    res.status(401).json({
      errors: error
    });
  }
});

module.exports = authController;