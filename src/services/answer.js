import { Answer } from '../models';
import User from './user';
import Helpers from '../utils';

const { fetchByAuthorName } = User;
const { filterForKeyValue } = Helpers;

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
    const skip = +options.page ? (+options.page - 1) * limit : 0;
    if (options.filter.authorName) {
      const { authorName } = options.filter;
      return AnswerService.fetchAnswerByAuthorName(authorName, skip, limit);
    }
    const filter = filterForKeyValue(options.filter) || {};
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

  /**
   * Finds a answer by its author's name.
   * @param {string} authorName - The answer's author name.
   * @param {number} skip - Offset value.
   * @param {number} limit - Max number of records.
   * @returns {Promise<object>} A promise object with search results.
   * @memberof AnswerService
   */
  static async fetchAnswerByAuthorName(authorName, skip, limit) {
    const users = await fetchByAuthorName(authorName);
    const idArr = users.map(async ({ _id }) => _id);
    const result = await Promise.all(idArr);
    return AnswerService.find({ author: { $in: [...result] } })
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

  /**
   * Finds a answer by its id.
   * @param {string} id - The answer's id.
   * @returns {Promise<object>} A promise object with search results.
   * @memberof QuestionService
   */
  static async fetchById(id) {
    return Answer.findById(id)
      .select('-__v')
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
