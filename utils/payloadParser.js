const jwt = require('jsonwebtoken');


function createPayload(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    accountName: user.accountName,
    gender: user.gender,
  };

  return {
    _id: user._id,
    username: user.username,
    gender: user.gender,
    imgThumb: user.image.thumbUrl,
    accessToken: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }),
  };

};

module.exports = {
  createPayload
};