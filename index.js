const express = require('express');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const cors = require('./middlewares/cors');


start();

async function start() {

  await mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/destianations', (req, res) => {
    res.json({ message: 'hello' });
  });

  app.listen(3030, () => console.log('>>> Server listening on port 3030...'));
}