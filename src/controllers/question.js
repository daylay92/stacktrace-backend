import { Question } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, questionResponse } = Helpers;

/**
 * A collection of methods that controls the success response
 * for CRUD operations on a Question Instance.
 *
 * @class QuestionController
 */
class QuestionController {
  /**
   * Registers a new user.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the question.
   * @memberof QuestionController
   */
  static async create(req, res) {
    try {
      const { body, data } = req;
      const question = new Question({ ...body, author: data.id });
      await question.save();
      const resQuestion = await question
        .populate('author', 'firstName lastName email')
        .execPopulate();
      const updatedQuestion = questionResponse(resQuestion);
      successResponse(res, updatedQuestion, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }
}

export default QuestionController;
