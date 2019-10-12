import { Question } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, modifyRes, filterObjBuilder } = Helpers;
const { fetch } = Question;

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
   * Fetches at most 30 questions.
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
      const filter = filterObjBuilder(req.query);
      const questions = await fetch({ page, limit, filter });
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
    try {
      const { question } = req;
      const resQuestion = await question
        .populate('upVote.by', 'firstName lastName email')
        .populate('downVote.by', 'firstName lastName email')
        .execPopulate();
      successResponse(res, resQuestion, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Update's a question's vote.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the question.
   * @memberof QuestionController
   */
  static async upDateQuestion(req, res) {
    try {
      const { question } = req;
      await question.save();
      const resQuestion = await question
        .populate('upVote.by', 'firstName lastName email')
        .populate('downVote.by', 'firstName lastName email')
        .execPopulate();
      const updatedQuestion = modifyRes(resQuestion);
      successResponse(res, updatedQuestion, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }
}

export default QuestionController;
