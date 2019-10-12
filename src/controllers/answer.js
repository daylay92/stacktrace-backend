import { Answer } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, modifyRes } = Helpers;

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
      const resAnswer = await answer
        .populate('author', 'firstName lastName email')
        .populate({
          path: 'question',
          select: '-__v -upVote.by -downVote.by -answers',
          populate: {
            path: 'author',
            select: 'firstName lastName email'
          }
        })
        .execPopulate();
      const updatedAnswer = modifyRes(resAnswer);
      successResponse(res, updatedAnswer, 201);
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
