/* eslint-disable no-console */
import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGODB_URI, MONGODB_DEV_URI, NODE_ENV } = process.env;
const connectionString = NODE_ENV === 'development' ? MONGODB_DEV_URI : MONGODB_URI;

/**
 * Implements configuration for MongoDB.
 *
 * @class DB
 */
class DB {
  /**
   * Establishes connection to the database and returns the connection object.
   *
   * @static
   * @returns { object } The connection object provided by mongoose.
   * @memberof DB
   */
  static async connect() {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('connection successful');
    return mongoose.connection;
  }
}

export default DB;
