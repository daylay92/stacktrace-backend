/* eslint-disable no-console */
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import DB from './database';
import routes from './routes';

const { NODE_ENV, PORT } = process.env;

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
routes(app);

// Handle Errors on dev & test env only
if (NODE_ENV !== 'production') app.use(errorHandler());

// Handle all Requests not Handled by the above routes
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'something is wrong'
  });
});

// set port
const port = PORT || 3000;

// listen for requests
(async () => {
  try {
    const db = await DB.connect();
    app.listen(port, () => {
      console.log(`Amazing Stuff is Happening on: ${port}`);
    });
    db.on('error', () => {
      console.log('something broke after connection was established');
    });
  } catch (err) {
    console.log(err);
  }
})();

export default app;
