import { Question } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, modifyRes } = Helpers;
const { fetch, fetchById } = Question;

/**
 * A collection of methods that controls the success response
 * for CRUD operations on a Question Instance.
 *
 * @class QuestionController
 */
class QuestionController {
  /**
   * Creates a new question.
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
      const updatedQuestion = modifyRes(resQuestion);
      successResponse(res, updatedQuestion, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Fetches atleast 30 questions.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the question.
   * @memberof QuestionController
   */
  static async getQuestions(req, res) {
    try {
      const { page, limit } = req.query;
      const questions = await fetch({ page, limit });
      successResponse(res, questions, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Fetches a question by its Id.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the question.
   * @memberof QuestionController
   */
  static async getQuestionById(req, res) {
    const { id } = req.params;
    try {
      const question = await fetchById(id);
      if (question) return successResponse(res, question, 200);
      errorResponse(res, {
        code: 404,
        message: 'A question with the id provided was not found'
      });
    } catch (e) {
      const regex = /Cast to ObjectId/i;
      if (regex.test(e.message)) {
        return errorResponse(res, {
          code: 400,
          message: 'Invalid question Id'
        });
      }
      errorResponse(res, {});
    }
  }
}

export default QuestionController;
