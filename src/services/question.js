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
   * @param {number} options.limit - Max number of records.
   * @param {number} options.page - Current page e.g: 1 represents first
   * 30 records by default and 2 represents the next 30 records .
   * @param {object} options.filter - Search criteria.
   * @returns {Promise<object>} A promise object with search results.
   * @memberof QuestionService
   */
  static async fetch(options = {}) {
    const limit = +options.limit || 30;
    const filter = options.filter || {};
    const skip = +options.page ? (+options.page - 1) * limit : 0;
    return QuestionService.find(filter)
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'author',
        select: '-__v -password -createdAt -updatedAt'
      })
      .populate({
        path: 'upVote.by',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'downVote.by',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'answers',
        select: '-__v -question',
        populate: {
          path: 'author',
          select: 'firstName lastName email'
        }
      });
  }

  /**
   * Finds a question by its id.
   * @param {string} id - The question's id.
   * @returns {Promise<object>} A promise object with search results.
   * @memberof QuestionService
   */
  static async fetchById(id) {
    return QuestionService.findById(id)
      .select('-__v')
      .populate({
        path: 'author',
        select: '-__v -password -createdAt -updatedAt'
      })
      .populate({
        path: 'answers',
        select: '-__v -question',
        populate: {
          path: 'author',
          select: 'firstName lastName email'
        }
      });
  }
}

export default QuestionService;
