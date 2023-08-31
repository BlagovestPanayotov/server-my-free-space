const authController = require('express').Router();

const { register, login } = require('../services/userService');
const { cookieSetter } = require('../utils/cookieSetter');


authController.post('/register', async (req, res) => {
  try {
    console.log('>>> /users/register');
    
    const token = await register(req.body.email, req.body.username, req.body.password, req.body.country, req.body.gender);
    cookieSetter(res, token);
    res.json(token);
  } catch (err) {
    console.log('>>> ERROR');
    console.log(`>>> ${err.message}`);

    res.status(400).json({
      message: err.message
    });
  }
});

authController.post('/login', async (req, res) => {
  try {
    console.log('>>> /users/login');

    const token = await login(req.body.email, req.body.password,);
    cookieSetter(res, token);
    res.json(token);
  } catch (err) {
    console.log('>>> ERROR');
    console.log(`>>> ${err.message}`);

    res.status(401).json({
      message: err.message
    });
  }
});

authController.use('/logout', async (req, res) => {
  console.log('>>> /users/logout');

  const token = req.cookies?.['atoken'] || '';
  console.log(token);
  cookieSetter(res, token, 'logout');
  res.status(204).end();
});

module.exports = authController;