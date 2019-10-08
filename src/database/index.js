import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGODB_URI, MONGODB_URI_DEV, NODE_ENV } = process.env;

const connectionString =
  NODE_ENV === 'development' ? MONGODB_URI_DEV : MONGODB_URI;
class DB {
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
