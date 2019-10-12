import { Answer } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, modifyRes, getQuery, notify } = Helpers;
const { fetch, populateOnCreate } = Answer;

/**
 * A collection of methods that controls the success response
 * for CRUD operations on an answer Instance.
 *
 * @class AnswerController
 */
class AnswerController {
  /**
   * Creates a new answer to a question.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the answer.
   * @memberof AnswerController
   */
  static async createAnswer(req, res) {
    try {
      const { body, data, question } = req;
      const answer = new Answer({ ...body, author: data.id, question: question._id });
      await answer.save();
      question.answers.push(answer._id);
      await question.save();
      const resAnswer = await populateOnCreate(answer);
      const updatedAnswer = modifyRes(resAnswer);
      const {
        question: {
          author: { email, firstName: questionAuthor }
        },
        author: { firstName, lastName }
      } = updatedAnswer;
      const answerAuthor = `${firstName} ${lastName}`;
      const notified = await notify(email, answerAuthor, question.text, questionAuthor);
      successResponse(res, { ...updatedAnswer, notified }, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Fetches at most 30 Answers.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the answers.
   * @memberof QuestionController
   */
  static async getAnswers(req, res) {
    try {
      const { page, limit } = req.query;
      const filter = getQuery(req.query);
      const answers = await fetch({ page, limit, filter });
      successResponse(res, answers, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Fetches an answer by its Id.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response containing the details of the answer.
   * @memberof QuestionController
   */
  static getAnswerById(req, res) {
    const { answer } = req;
    successResponse(res, answer, 200);
  }
}

export default AnswerController;
