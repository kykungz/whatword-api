import BaseError from './BaseError'
export default class GameNotFound extends BaseError {
  constructor () {
    super('Game not found!', 404)
  }
}
