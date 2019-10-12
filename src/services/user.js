import { User } from '../models';
import Helpers from '../utils';

const { userFilterObj, checkFilter } = Helpers;
/**
 * It is the interface of user model.
 *
 * @class UserService
 */
class UserService extends User {
  /**
   * Finds a user with properties specified in the argument.
   * @param {number | object | string} options - An object containing properties to
   * be used as search criteria.
   * @param {number} options.limit - Max number of records.
   * @param {number} options.page - Current page e.g: 1 represents first
   * 30 records by default and 2 represents the next 30 records .
   * @param {object} options.filter - Search criteria.
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetch(options = {}) {
    const limit = +options.limit || 30;
    const skip = +options.page ? (+options.page - 1) * limit : 0;
    if (options.filter.name) {
      const { name } = options.filter;
      return UserService.fetchByAuthorName(name, skip, limit);
    }
    const filter = userFilterObj(options.filter) || {};
    return UserService.find(checkFilter(filter))
      .select('-__v -password')
      .skip(skip)
      .limit(limit);
  }

  /**
   * Finds a user by his/her email
   * @param {string} id - User's email address
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetchById(id) {
    return UserService.findById(id).select('-__v -password');
  }

  /**
   * Finds a user by his/her email
   * @param {string} email - User's email address
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetchByEmail(email) {
    return UserService.find({ email }).select('-__v -password');
  }

  /**
   * Finds a collection of users whose first names matches the search field
   * @param {string} name - User's name.
   * @param {number} skip - Offset value.
   * @param {number} limit - Max number of records.
   * @returns {Promise<object>} A promise object with user detail.
   * @memberof UserService
   */
  static async fetchByAuthorName(name, skip, limit = 0) {
    const skipValue = skip || 0;
    const nameArr = name.split(' ');
    let filter;
    if (nameArr.length === 1) filter = { firstName: new RegExp(nameArr[0], 'i') };
    else {
      filter = {
        firstName: new RegExp(nameArr[0], 'i'),
        lastName: new RegExp(nameArr[1], 'i')
      };
    }
    return UserService.find(filter)
      .select('-__v -password')
      .skip(skipValue)
      .limit(limit);
  }
}

export default UserService;
