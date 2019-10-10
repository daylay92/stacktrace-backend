import { validateQuestionSchema } from '../validations';
import Helpers from '../utils';
import { Question } from '../services';

const { errorResponse } = Helpers;
const { fetchById } = Question;

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

  /**
   * Checks that the id in the path belongs to an existing question.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof QuestionMiddleware
   *
   */
  static async validateId(req, res, next) {
    const { id } = req.params;
    try {
      const question = await fetchById(id);
      if (!question) {
        return errorResponse(res, {
          code: 404,
          message: 'A question with the id provided was not found'
        });
      }
      req.question = question;
      next();
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

  /**
   * It checks if a question that a user requests to be
   * upvoted has already been downvoted by the user and
   * removes the downvote on the question by that user if found.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof QuestionMiddleware
   *
   */
  static async syncUpVoteWithDownVote(req, res, next) {
    const { question } = req;
    const { id } = req.data;
    const isDownVotedIndex = question.downVote.by.findIndex(
      userId => userId.toString() === id.toString()
    );
    if (isDownVotedIndex !== -1) {
      question.downVote.by.splice(isDownVotedIndex, 1);
      question.downVote.total = question.downVote.by.length;
    }
    next();
  }

  /**
   * It checks if a question that a user requests to be
   * downvote was previously upvoted by the user and
   * removes the upvote on the question by that user if found.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof QuestionMiddleware
   *
   */
  static async syncDownVoteWithUpVote(req, res, next) {
    const { question } = req;
    const { id } = req.data;
    const isUpVotedIndex = question.upVote.by.findIndex(
      userId => userId.toString() === id.toString()
    );
    if (isUpVotedIndex !== -1) {
      question.upVote.by.splice(isUpVotedIndex, 1);
      question.upVote.total = question.upVote.by.length;
    }
    next();
  }

  /**
   * Checks if a user who has requested to upvote a question
   *  has already upvoted the question with a previous request and removes
   * the upvote for the user if that's the case otherwise, it adds
   *  an upvote to the question for that user.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof QuestionMiddleware
   *
   */
  static async syncUpVote(req, res, next) {
    const { question } = req;
    const { id } = req.data;
    const isUpVotedIndex = question.upVote.by.findIndex(
      userId => userId.toString() === id.toString()
    );
    if (isUpVotedIndex !== -1) question.upVote.by.splice(isUpVotedIndex, 1);
    else question.upVote.by.push(id);
    question.upVote.total = question.upVote.by.length;
    next();
  }

  /**
   * Checks if a user who has requested to upvote a question
   *  has already upvoted the question with a previous request and removes
   * the upvote for the user if that's the case otherwise, it adds
   *  an upvote to the question for that user.
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof QuestionMiddleware
   *
   */
  static async syncDownVote(req, res, next) {
    const { question } = req;
    const { id } = req.data;
    const isDownVotedIndex = question.downVote.by.findIndex(
      userId => userId.toString() === id.toString()
    );
    if (isDownVotedIndex !== -1) question.downVote.by.splice(isDownVotedIndex, 1);
    else question.downVote.by.push(id);
    question.downVote.total = question.downVote.by.length;
    next();
  }
}

export default QuestionMiddleware;
