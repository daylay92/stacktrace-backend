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
   * Checks for token in the authorization header property.
   * @static
   * @param {object} authorization - The authorization header property.
   * @memberof Helpers
   * @returns {Boolean} - Returns true if token is found and false if otherwise.
   */
  static getAuthorizationToken(authorization) {
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1]
        ? authorization.split(' ')[1]
        : authorization;
    }
    return bearerToken;
  }

  /**
   * Aggregrates a search for the token in a number of places.
   * @static
   * @param {Request} req - The express request object.
   * @memberof Helpers
   * @returns {string | null } - Returns jwt token or null.
   */
  static checkToken(req) {
    const {
      headers: { authorization }
    } = req;
    const bearerToken = Helpers.getAuthorizationToken(authorization);
    return (
      bearerToken || req.headers['x-access-token'] || req.headers.token || req.body.token
    );
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
}

export default Helpers;
