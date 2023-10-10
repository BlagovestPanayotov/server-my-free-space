const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const corsConfig = require('./middlewares/corsConfig');
const trimBody = require('./middlewares/trimBody');
const session = require('./middlewares/session');

const authController = require('./controllers/authController');
const destinationController = require('./controllers/destinationController');
const accessoryDestController = require('./controllers/accessorydestController');
const User = require('./models/User');


start();

async function start() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // await User.updateMany({}, { $set: { accountNameChanged: false } });
    // mongoose.disconnect();
    const app = express();
    
    app.use(express.json({ limit: '50mb' }));
    app.use(cors(corsConfig));
    app.use(trimBody());
    app.use(session());

    app.use('/users', authController);
    app.use('/dest', destinationController);
    app.use('/accessory', accessoryDestController);

    app.listen(3030, () => console.log('>>> Server listening on port 3030...'));

  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}