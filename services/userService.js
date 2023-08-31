const bcrypt = require('bcrypt');

const User = require('../models/User');
const { createToken } = require('../utils/tokenParser');

async function register(email, username, password, country, gender) {
  const existing = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

  if (existing) {
    throw new Error('Email is taken!');
  }

  const user = await User.create({
    email,
    username,
    country,
    gender,
    hashedPassword: await bcrypt.hash(password, 12)
  });

  return {
    _id: user._id,
    username: user.username,
    gender: user.gender,
    accessToken: createToken(user)
  };
}

async function login(email, hashedPassword) {

}

async function logout() {

}

module.exports = {
  register,
  login,
  logout
};
