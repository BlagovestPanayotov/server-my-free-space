const express = require('express');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const cors = require('./middlewares/cors');
const authController = require('./controllers/authController');
const destinationController = require('./controllers/destinationController');


start();

async function start() {

  await mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/users', authController);
  app.use('/dest', destinationController);

  app.listen(3030, () => console.log('>>> Server listening on port 3030...'));
}