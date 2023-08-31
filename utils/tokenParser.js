const jwt = require('jsonwebtoken');


function createToken(user) {
  const payload = {
    _id: user._id,
    username: user.email,
    gender: user.gender
  };

  return jwt.sign(payload, process.env.JWT_SECRET);

};

module.exports = {
  createToken
};