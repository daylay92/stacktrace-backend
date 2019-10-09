import validateAuthSchema from '../validations';
import Helpers from '../utils';
import User from '../services';

const { fetchByEmail } = User;
const { errorResponse } = Helpers;

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
   * Validates user's registration data.
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
}

export default AuthMiddleware;
