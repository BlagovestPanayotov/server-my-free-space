const destinationController = require('express').Router();

destinationController.get('/destinations', (req, res) => {
  console.log('>>> /dest');

  res.json([]);
});

module.exports = destinationController;