import { validateAuthSchema } from '../validations';
import Helpers from '../utils';
import { User } from '../services';

const { fetchByEmail } = User;
const { errorResponse, verifyToken, checkToken } = Helpers;

/**
 * A collection of middleware methods used to verify the autheticity
 * of a user's request through the Auth route.
 *
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * Validates user's registration data.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof AuthMiddleware
   *
   */
  static validate(req, res, next) {
    const message = validateAuthSchema(req.body);
    if (message === true) return next();
    errorResponse(res, {
      code: 400,
      message
    });
  }

  /**
   * Checks if the email of the new user already exists.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof AuthMiddleware
   *
   */
  static async checkEmailAlreadyExists(req, res, next) {
    try {
      const { email } = req.body;
      const [user] = await fetchByEmail(email);
      if (user) {
        return errorResponse(res, {
          code: 409,
          message: 'A user with your email already exists'
        });
      }
      next();
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Validates user's login credentials.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof AuthMiddleware
   *
   */
  static async validateLoginFields(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, {
        code: 401,
        message: 'Invalid email/password'
      });
    }
    next();
  }

  /**
   * Validates user's login credentials, with emphasis on the
   * existance of a user with the provided email address.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof AuthMiddleware
   *
   */
  static async verifyIfExistingUser(req, res, next) {
    try {
      const { email } = req.body;
      const [user] = await User.find({ email });
      if (!user) {
        return errorResponse(res, {
          code: 401,
          message: 'Invalid email/password'
        });
      }
      req.user = user;
      next();
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Verifies the validity of a user's access token or and the presence of it
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof AuthMiddleware
   *
   */
  static authenticate(req, res, next) {
    const token = checkToken(req);
    if (!token) {
      return errorResponse(res, {
        code: 401,
        message: 'Access denied, Token required'
      });
    }
    try {
      const decoded = verifyToken(token);
      req.data = decoded;
      next();
    } catch (err) {
      errorResponse(res, { code: 401, message: err.message });
    }
  }
}

export default AuthMiddleware;
