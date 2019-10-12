import Helpers from '../utils';
import { Answer } from '../services';

const { fetchById } = Answer;
const { errorResponse } = Helpers;

/**
 * A collection of middleware methods used to verify the autheticity
 * of a request for an answer through the Answer route.
 *
 * @class AnswerMiddleware
 */
class AnswerMiddleware {
  /**
   * Checks that the id in the path belongs to an existing answer.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof AnswerMiddleware
   *
   */
  static async validateId(req, res, next) {
    const { id } = req.params;
    try {
      const answer = await fetchById(id);
      if (!answer) {
        return errorResponse(res, {
          code: 404,
          message: 'An answer with the id provided was not found'
        });
      }
      req.answer = answer;
      next();
    } catch (e) {
      const regex = /Cast to ObjectId/i;
      if (regex.test(e.message)) {
        return errorResponse(res, {
          code: 400,
          message: 'Invalid answer Id'
        });
      }
      errorResponse(res, {});
    }
  }
}

export default AnswerMiddleware;
