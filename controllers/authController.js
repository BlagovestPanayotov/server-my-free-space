const authController = require('express').Router();
const { body, validationResult } = require('express-validator');

const { register, login } = require('../services/userService');
const { authHeaderSetter } = require('../utils/authHeaderSetter');
const { countriesList, PASSWORD_REGEXP } = require('../utils/assets');
const errorParser = require('../utils/errorParser');


authController.post('/register',
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
      console.log('>>> /users/register');

      const { errors } = validationResult(req);

      if (errors.length > 0) {
        throw errors;
      }

      const token = await register(req.body.email, req.body.username, req.body.password, req.body.country, req.body.gender);
      authHeaderSetter(res, token);
      res.json(token);
    } catch (err) {
      const error = errorParser(err);
      console.log('>>> ERROR');
      console.log(`>>> ${error}`);

      res.status(400).json({
        errors: error
      });
    }
  });

authController.post('/login',
  body('email').isEmail().withMessage('Invalid email or password!'),
  body('password').isLength({ min: 1 }).withMessage('Invalid email or password!'),
  async (req, res) => {
    try {
      console.log('>>> /users/login');

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

authController.use('/logout', async (req, res) => {
  console.log('>>> /users/logout');

  const token = req.token || '';
  authHeaderSetter(res, token, 'logout');
  res.status(204).end();
});

module.exports = authController;