const jwt = require('jsonwebtoken');


function createPayload(user) {
  const payload = {
    _id: user._id,
    username: user.email,
    gender: user.gender
  };

  return {
    _id: user._id,
    username: user.username,
    gender: user.gender,
    accessToken: jwt.sign(payload, process.env.JWT_SECRET)
  };

};

module.exports = {
  createPayload
};