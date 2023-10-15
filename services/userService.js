const bcrypt = require('bcrypt');

const User = require('../models/User');
const { createPayload } = require('../utils/payloadParser');
const Util = require('../models/Util');
const { getAccountName, getRandomUrl, getRandomPass } = require('../utils/valuesGenerator');
const { sendVerificationEmail } = require('../utils/nodemailer/nodemailerProperties');

async function register(email, username, password, country, gender) {
  const existing = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

  if (existing) {
    throw new Error('Email is taken!');
  }

  const util = await Util.findById('6523f20a83b3557fd90806a8');

  const accountName = getAccountName(util.guestNumber);

  const verifyUrl = getRandomUrl();

  sendVerificationEmail(email,verifyUrl)

  const user = await User.create({
    email,
    username,
    country,
    gender,
    hashedPassword: await bcrypt.hash(password, 12),
    accountName,
    accountNameChanged: false,
    verifyUrl
  });

  util.guestNumber++;
  await util.save();

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

async function updateUser(newEmail, newUsername, newCountry, newGender, newAccountName, userId) {
  const [bodyUser, user] = await Promise.all([User.findOne({ email: newEmail }), User.findById(userId)]);

  if (!bodyUser._id.equals(user._id)) {
    throw new Error('You can update only your own account!');
  }

  if (newAccountName != user.accountName && user.accountNameChanged) {
    throw new Error('You have already changed your Account Name!');
  }

  if (newAccountName != user.accountName) {
    if (newAccountName.toLowerCase().startsWith('guest')) {
      throw new Error('Account name taken, try anothe one!');
    }

    const accountNameTaken = await User.findOne({ accountName: newAccountName }).collation({ locale: 'en', strength: 2 });;
    if (accountNameTaken) {
      throw new Error('Account name taken, try anothe one!');
    }
    user.accountNameChanged = true;
  }

  user.username = newUsername;
  user.country = newCountry;
  user.gender = newGender;
  user.accountName = newAccountName;

  const token = createPayload(user);

  await user.save();

  return [user, token];
}

module.exports = {
  register,
  login,
  logout,
  updateUser
};
