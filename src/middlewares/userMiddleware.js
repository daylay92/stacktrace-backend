import Helpers from '../utils';
import { User } from '../services';

const { fetchById } = User;
const { errorResponse } = Helpers;

/**
 * A collection of middleware methods used to verify the autheticity
 * of a request for an user's account through the user route.
 *
 * @class UserMiddleware
 */
class UserMiddleware {
  /**
   * Checks that the id in the path belongs to an existing answer.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof UserMiddleware
   *
   */
  static async validateId(req, res, next) {
    const { id } = req.params;
    try {
      const user = await fetchById(id);
      if (!user) {
        return errorResponse(res, {
          code: 404,
          message: 'A user with the id provided was not found'
        });
      }
      req.user = user;
      next();
    } catch (e) {
      const regex = /Cast to ObjectId/i;
      if (regex.test(e.message)) {
        return errorResponse(res, {
          code: 400,
          message: 'Invalid user Id'
        });
      }
      errorResponse(res, {});
    }
  }
}

export default UserMiddleware;
