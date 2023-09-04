const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const corsConfig = require('./middlewares/corsConfig');
const authController = require('./controllers/authController');
const destinationController = require('./controllers/destinationController');
const trimBody = require('./middlewares/trimBody');
const session = require('./middlewares/session');


start();

async function start() {

  await mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const app = express();

  app.use(express.json());
  app.use(cors(corsConfig));
  app.use(trimBody());
  app.use(session());

  app.use('/users', authController);
  app.use('/dest', destinationController);

  app.listen(3030, () => console.log('>>> Server listening on port 3030...'));
}