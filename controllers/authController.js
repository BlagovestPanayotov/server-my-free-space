const authController = require('express').Router();
const { body, validationResult } = require('express-validator');

const { register, login, updateUser, resendVerEmail } = require('../services/userService');
const { authHeaderSetter } = require('../utils/authHeaderSetter');
const { countriesList, PASSWORD_REGEXP } = require('../utils/assets');
const errorParser = require('../utils/errorParser');
const User = require('../models/User');
const { isGuest, hasUser } = require('../middlewares/guards');
const { getRandomUrl } = require('../utils/valuesGenerator');
const { upload } = require('../utils/multerConfig');
const imgbbUploader = require('imgbb-uploader/lib/cjs');


authController.post('/register', isGuest(),
  body('email').isEmail().withMessage('Invalid email!'),
  body('password').custom(value => {
    const match = PASSWORD_REGEXP.test(value);
    if (match) {
      return true;
    }
    throw new Error('Password has invalid format!');
  }),
  body('username').isLength({ min: 5, max: 20 }).withMessage('The username must be between 5 and 20 characters long!'),
  body('country').isIn(countriesList).withMessage('Incorrect Country!'),
  body('gender').isIn(['M', 'W', 'unknown']).withMessage('Incorrect Gender!'),
  async (req, res) => {
    try {
      console.log('>>> POST /users/register');

      const { errors } = validationResult(req);

      if (errors.length > 0) {
        throw errors;
      }

      const token = await register(req.body.email, req.body.username, req.body.password, req.body.country, req.body.gender);

      authHeaderSetter(res, token);
      res.json(token);
    } catch (err) {
      const error = errorParser(err);
      console.log('>>> ERROR');
      console.log(`>>> ${error}`);

      res.status(409).json({
        errors: error
      });
    }
  });

authController.post('/login',
  body('email').isEmail().withMessage('Invalid email or password!'),
  body('password').isLength({ min: 1 }).withMessage('Invalid email or password!'),
  async (req, res) => {
    try {
      console.log('>>> POST /users/login');

      const { errors } = validationResult(req);

      if (errors.length > 0) {
        throw errors;
      }

      const token = await login(req.body.email, req.body.password,);
      authHeaderSetter(res, token);
      res.json(token);
    } catch (err) {
      const error = errorParser(err);

      console.log('>>> ERROR');
      console.log(`>>> ${error}`);

      res.status(401).json({
        errors: error
      });
    }
  });

authController.use('/logout', hasUser(), async (req, res) => {
  console.log('>>> USE /users/logout');

  const token = req.token || '';
  authHeaderSetter(res, token, 'logout');
  res.status(204).end();
});

authController.get('/user', async (req, res) => {
  try {
    console.log('>>> GET /users/user');

    const userId = req.user._id;

    const user = await User.findById(userId);

    const { email, username, country, gender, accountName, image, accountNameChanged } = user;

    res.json({ email, username, country, gender, _id: userId, accountName, image, accountNameChanged });
  } catch (err) {
    res.json(undefined);
  }
});

authController.put('/user', hasUser(),
  body('username').isLength({ min: 5, max: 20 }).withMessage('The username must be between 5 and 20 characters long!'),
  body('country').isIn(countriesList).withMessage('Incorrect Country!'),
  body('gender').isIn(['M', 'W', 'unknown']).withMessage('Incorrect Gender!'),
  body('accountname').isLength({ min: 5, max: 20 }).withMessage('The account name must be between 5 and 20 characters long!'),
  upload.single('fileInput'),
  async (req, res) => {
    try {
      console.log('>>> PUT /users/user');


      const imageFile = req.file;
      const newEmail = req.body.email;
      const newUsername = req.body.username;
      const newCountry = req.body.country;
      const newGender = req.body.gender;
      const newAccountName = req.body.accountname;
      const newRemoveImage = req.body.removeImage === 'true';
      let newImage;
      let imgbbResponse;

      if (!newRemoveImage && imageFile) {
        const options = {
          apiKey: process.env.IMGBB_API_KEY,
          base64string: imageFile.buffer.toString('base64'),
        };

        imgbbResponse = await imgbbUploader(options);

        newImage = {
          imgUrl: imgbbResponse.image.url,
          thumbUrl: imgbbResponse.thumb.url,
        };
      }

      const userId = req.user._id;


      const [user, token] = await updateUser(newEmail, newUsername, newCountry, newGender, newAccountName, newImage, newRemoveImage, userId);

      authHeaderSetter(res, token);

      const { email, username, country, gender, accountName, accountNameChanged, verified, image } = user;

      res.json({ email, username, country, gender, _id: userId, accountName, accountNameChanged, verified, image });
    } catch (err) {
      const error = errorParser(err);
      console.log(`>>> ERROR ${error}`);

      res.status(401).json({
        errors: error
      });
    }
  });

authController.get('/user/view/:id', hasUser(), async (req, res) => {
  try {
    console.log(`>>> GET /users/user/view/${req.params.id}`);

    const userId = req.params.userId;

    const user = await User.findById(userId);

    const { country, gender, accountName, image: { imgUrl }, verified } = user;

    res.json({ country, gender, accountName, imgUrl, verified });
  } catch (err) {
    const error = errorParser(err);
    console.log(`>>> ERROR ${error}`);
    res.status(401).json('User Not Found!');
  }
});

authController.get('/user/verify', async (req, res) => {
  try {
    console.log('>>> GET /users/user/verify');

    const userId = req.user._id;

    const user = await User.findById(userId);

    const { accountName, gender, image: { thumbUrl }, verified } = user;

    res.json({ accountName, gender, _id: userId, thumbUrl, verified });
  } catch (err) {
    res.json(undefined);
  }
});



authController.get('/user/verify-resend', hasUser(), async (req, res) => {
  try {
    console.log('>>> GET /users/user/verify-resend');

    const user = await User.findById(req.user._id);

    const timeNow = new Date();
    const expTime = new Date();
    expTime.setDate(user.verifyUrl._createdAt.getDate() + 1);

    if (expTime > timeNow && user.verifyUrl.attempt > 2) {
      throw new Error('You requested to many emails in a short time. Try to find the verification email in your spam emails, or try again later!');
    }

    if (expTime < timeNow && user.verifyUrl.attempt >= 3) {
      user.verifyUrl.attempt = 0;
      user.verifyUrl._createdAt = timeNow;
    }

    user.verifyUrl.url = getRandomUrl();
    user.verifyUrl.attempt++;
    await user.save();
    resendVerEmail(user.email, user.verifyUrl.url);

    res.end();
  } catch (err) {
    const error = errorParser(err);
    console.log('>>> ERROR');
    console.log(`>>> ${error}`);

    res.status(401).json({
      errors: error
    });
  }


});

authController.get('/user/verify-email', async (req, res) => {
  try {

    console.log('>>> GET /users/user/verify-email');

    const token = req.query.token;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (token !== user.verifyUrl.url) {
      throw new Error('Invalid verification URL!');
    }
    user.verified = true;

    await user.save();

    res.status(200).end();
  } catch (err) {
    const error = errorParser(err);
    console.log('>>> ERROR');
    console.log(`>>> ${error}`);

    res.status(401).json({
      errors: error
    });
  }
});

module.exports = authController;