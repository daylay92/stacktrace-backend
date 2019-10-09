import { Question } from '../models';

/**
 * It is the interface for question model.
 *
 * @class QuestionService
 */
class QuestionService extends Question {
  /**
   * Finds a question with properties specified in the argument.
   * @param {number | object | string} options - An object containing properties to
   * be used as search criteria.
   * @returns {Promise<object>} A promise object with search results.
   * @memberof QuestionService
   */
  static async fetch(options = {}) {
    return QuestionService.find(options).select('-__v -password');
  }
}

export default QuestionService;
