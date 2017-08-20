import BaseError from './BaseError'
export default class InvalidForm extends BaseError {
  constructor (message) {
    super(message, 400)
  }
}
