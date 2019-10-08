import 'dotenv/config';
import express from 'express';
import { json, urlencoded } from 'express';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import DB from './database';

const { NODE_ENV, PORT } = process.env;

const app = express();

// Middlewares

app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Handle Errors on dev & test env only
if (NODE_ENV !== 'production') app.use(errorHandler());

// Handle all Requests not Handled by the above routes
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'something is wrong'
  });
});
//set port
const port = PORT || 3000;

//listen for requests
(async () => {
  try {
    const db = await DB.connect();
    app.listen(port, () => {
      console.log(`Amazing Stuff is Happening on: ${port}`);
    });
    db.on('error', () => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
})();

export default app;
