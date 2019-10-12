import Helpers from '../utils';
import { User } from '../services';

const { successResponse, errorResponse, getQuery } = Helpers;
const { fetch } = User;

/**
 * A collection of methods that controls the success response
 * for CRUD operations on a User Instance.
 *
 * @class UserController
 */
class UserController {
  /**
   * Fetches atleast 30 questions.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the question.
   * @memberof QuestionController
   */
  static async getUsers(req, res) {
    try {
      const { page, limit } = req.query;
      const filter = getQuery(req.query);
      const users = await fetch({ page, limit, filter });
      successResponse(res, users, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Returns the a user object with the id in the path variable.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the user.
   * @memberof UserController
   */
  static async getUser(req, res) {
    const { user } = req;
    successResponse(res, user, 200);
  }
}

export default UserController;
