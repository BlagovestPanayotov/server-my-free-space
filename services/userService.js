const bcrypt = require('bcrypt');

const User = require('../models/User');
const { createPayload } = require('../utils/payloadParser');

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

  return createPayload(user);
}

async function login(email, password) {
  const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

  if (!user) {
    throw new Error('Incorect email or password!');
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error('Incorect email or password!');
  }

  return createPayload(user);
}

async function logout() {

}

module.exports = {
  register,
  login,
  logout
};
