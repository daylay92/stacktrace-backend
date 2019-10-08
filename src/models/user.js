import mongoose from 'mongoose';
import Helpers from '../utils';

const { Schema } = mongoose;

const { hashPassword } = Helpers;

const options = { timestamp: true };

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 15,
      minLength: 2
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 15,
      minLength: 2
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      set: (plainPassword) => hashPassword(plainPassword)
    }
  },
  options
);

const User = mongoose.model('User', UserSchema);

export default User;
