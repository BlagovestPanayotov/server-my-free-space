const authController = require('express').Router();

const { register } = require('../services/userService');


authController.post('/register', async (req, res) => {
  try {
    console.log('>>> /users/register');
    const token = await register(req.body.email, req.body.username, req.body.password, req.body.country, req.body.gender);
    res.json(token);
  } catch (err) {
    console.log('>>> ERROR');
    console.log(`>>> ${err.message}`);

    res.status(400).json({
      message: err.message
    });
  }
});

module.exports = authController;