import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { SECRET } = process.env;

/**
 *Contains Helper methods
 *
 * @class Helpers
 */
class Helpers {
  /**
   * Hashes a password
   * @static
   * @param {string} plainPassword - Password to encrypt.
   * @memberof Helpers
   * @returns {string} - Encrypted password.
   */
  static hashPassword(plainPassword) {
    const salter = bcrypt.genSaltSync;
    const hasher = bcrypt.hashSync;
    return hasher(plainPassword, salter(10));
  }

  /**
   * Compares a password with a given hash
   * @static
   * @param {string} plainPassword - Plain text password.
   * @param {string} hash - Encrypted password.
   * @memberof Helpers
   * @returns {boolean} - returns true if there is a match and false otherwise.
   */
  static comparePassword(plainPassword, hash) {
    return bcrypt.compareSync(plainPassword, hash);
  }

  /**
   *  Synchronously signs the given payload into a JSON Web Token string.
   * @static
   * @param {string | number | Buffer | object} payLoad Payload to sign.
   * @param {string | number} expiresIn Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 2 hours.
   * @memberof Helpers
   * @returns {string} JWT token.
   */
  static generateToken(payLoad, expiresIn = '2h') {
    return jwt.sign(payLoad, SECRET, { expiresIn });
  }

  /**
   *
   *  Synchronously verify the given JWT token using a secret
   * @static
   * @param {*} token - JWT token.
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Helpers
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      throw new Error('Invalid Token');
    }
  }

  /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} data - The payload.
   * @param {number} code -  HTTP Status code.
   * @memberof Helpers
   * @returns {JSON} - A JSON success response.
   */
  static successResponse(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  }

  /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - The payload.
   * @param {number} options.code -  HTTP Status code, default is 500.
   * @param {string} options.message -  Error message.
   * @param {object|array  } options.errors -  A collection of  error message.
   * @memberof Helpers
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse(
    res,
    { code = 500, message = 'Some error occurred, try again', errors }
  ) {
    return res.status(code).json({
      status: 'fail',
      error: {
        message,
        errors
      }
    });
  }

  /**
   * Checks for token in the authorization and x-access-token header properties.
   * @static
   * @param {object} headers - The headers object.
   * @memberof Helpers
   * @returns {string | null} - Returns token or null.
   */
  static getAuthorizationToken(headers) {
    let bearerToken = null;
    if (headers.authorization) {
      bearerToken = headers.authorization.split(' ')[1]
        ? headers.authorization.split(' ')[1]
        : headers.authorization;
    }
    return bearerToken || headers['x-access-token'];
  }

  /**
   * Aggregrates a search for the access token in a number of places.
   * @static
   * @param {Request} req - The express request object.
   * @memberof Helpers
   * @returns {string | null } - Returns jwt token or null.
   */
  static checkToken(req) {
    const { headers, cookies, body } = req;
    const token = Helpers.getAuthorizationToken(headers);
    return cookies.token || token || headers.token || body.token;
  }

  /**
   * Makes of a model instance, removes the __v property and  changes
   *  the _id property to id, returning a new javascript object literal.
   * @static
   * @param {object} data - New Instance.
   * @memberof Helpers
   * @returns {object } - A new javascript object.
   */
  static simpleExtract(data) {
    const res = { ...data._doc };
    delete res._id;
    delete res.__v;
    return { id: data._id, ...res };
  }

  /**
   * Transforms the author object.
   * @static
   * @param {object} data - New Instance.
   * @memberof Helpers
   * @returns {object } - A new javascript object.
   */
  static questionResponse(data) {
    const res = Helpers.simpleExtract(data);
    const { firstName, lastName, email } = { ...res.author._doc };
    return { ...res, author: { id: res.author._id, firstName, lastName, email } };
  }

  /**
   * Extracts some user properties to be sent as a response and adds jwt token.
   * @static
   * @param {object} user - New User Instance.
   * @memberof Helpers
   * @returns {object } - A new object containing essential user properties and jwt token.
   */
  static createUserResponse(user) {
    const { _id: id, firstName, lastName, email } = { ...user._doc };
    const token = Helpers.generateToken({ email, id });
    return {
      id,
      firstName,
      lastName,
      email,
      token
    };
  }

  /**
   * It extracts a validation error label from the Joi error object.
   * @static
   * @param {object} error - Joi error object.
   * @memberof Helpers
   * @returns {string | null } - A validation error message or null if all entries are valid.
   */
  static getErrorLabel(error) {
    if (error) {
      const [
        {
          context: { label }
        }
      ] = error.details;
      return label;
    }
    return null;
  }
}

export default Helpers;
