const destinationController = require('express').Router();

destinationController.get('/destinations', (req, res) => {
  console.log('>>> /dest/destinations');

  console.log(req.user);

  res.json([]);
});

module.exports = destinationController;