import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './routes/index.js';

const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Router - http://localhost:3002
app.use('/', router);

async function start() {
  try {
    await mongoose
      .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.mxaqq57.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
      )
      .then(() => console.log('Database: ok'))
      .catch((err) => console.log('Database error:', err));

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}

start();