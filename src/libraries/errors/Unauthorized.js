import BaseError from './BaseError'
export default class Unauthorized extends BaseError {
  constructor (message) {
    super(message, 401)
  }
}
