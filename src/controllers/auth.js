import User from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, createUserResponse } = Helpers;

/**
 * A collection of methods that controls issues the final response during authetication.
 *
 * @class Auth
 */
class Auth {
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
      successResponse(res, userData, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }
}

export default Auth;
