import { Answer } from '../models';

/**
 * It is the interface of answer model.
 *
 * @class AnswerService
 */
class AnswerService extends Answer {
  /**
   * Fetches an answer by the filter parameters.
   * @param {number | object | string} options - An object containing properties to
   * be used as search criteria.
   * @param {number} options.limit - Max number of records.
   * @param {number} options.page - Current page e.g: 1 represents first
   * 30 records by default and 2 represents the next 30 records.
   * @param {object} options.filter - Search criteria.
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetch(options = {}) {
    const limit = +options.limit || 30;
    const filter = options.filter || {};
    const skip = +options.page ? (+options.page - 1) * limit : 0;
    return AnswerService.find(filter)
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'question',
        select: '-__v -upVote.by -downVote.by -answers',
        populate: {
          path: 'author',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'author',
        select: '-__v -password -createdAt -updatedAt'
      });
  }
}

export default AnswerService;
