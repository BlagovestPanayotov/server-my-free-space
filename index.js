const express = require('express');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const cors = require('./middlewares/cors');

const DB_URL = process.env.DATABASE_URL


start();

async function start() {

    await mongoose.connect('mongodb://127.0.0.1:27017/my-free-space');

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.get('/destianations', (req, res) => {
      res.json({ message: 'hello' });
    });

    app.listen(3030, () => console.log('>>> Server listening on port 3030...'));
}