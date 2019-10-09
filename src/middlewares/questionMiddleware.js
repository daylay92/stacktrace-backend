import { validateQuestionSchema } from '../validations';
import Helpers from '../utils';

const { errorResponse } = Helpers;

/**
 * A collection of middleware methods used to verify the autheticity
 * of a user's request through the Question route.
 *
 * @class QuestionMiddleware
 */
class QuestionMiddleware {
  /**
   * Validates user's question.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof QuestionMiddleware
   *
   */
  static validate(req, res, next) {
    const message = validateQuestionSchema(req.body);
    if (message === true) return next();
    errorResponse(res, {
      code: 400,
      message
    });
  }
}

export default QuestionMiddleware;
