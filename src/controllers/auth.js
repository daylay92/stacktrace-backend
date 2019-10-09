import { User } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, createUserResponse, comparePassword } = Helpers;

/**
 * A collection of methods that controls and issues the final response during authetication.
 *
 * @class AuthController
 */
class AuthController {
  /**
   * Registers a new user.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with the registered user's details and a JWT.
   * @memberof Auth
   */
  static async signup(req, res) {
    try {
      const user = new User(req.body);
      await user.save();
      const userData = createUserResponse(user);
      res.cookie('token', userData.token, { maxAge: 7200000, httpOnly: true });
      return successResponse(res, userData, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Logs in a user.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with the user's details and a JWT.
   * @memberof Auth
   */
  static async signin(req, res) {
    try {
      const { user, body } = req;
      const isAuthenticUser = comparePassword(body.password, user.password);
      if (!isAuthenticUser) {
        return errorResponse(res, {
          code: 401,
          message: 'Invalid email/password'
        });
      }
      const userData = createUserResponse(user);
      res.cookie('token', userData.token, { maxAge: 7200000, httpOnly: true });
      successResponse(res, userData, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }
}

export default AuthController;
