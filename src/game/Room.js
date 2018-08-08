import { generateRoomId } from '../libraries/util'
import _ from 'lodash'

export default class Room {
  constructor ({ wordBank, color, password }) {
    this.id = generateRoomId()
    this.password = password
    this.wordBank = wordBank.slice()
    this.remainingWords = wordBank.slice()
    this.color = color
    this.hidingWord = undefined
    this.state = {
      id: this.id,
      currentWord: undefined,
      score: 0,
      remaining: this.remainingWords.length,
      color: this.color
    }
    this.restart()
  }

  auth (password) {
    return this.password === password
  }

  correct () {
    const random = Math.floor(Math.random() * this.remainingWords.length)
    this.state.currentWord = _.pullAt(this.remainingWords, random)[0]
    this.state.score++
    this.state.remaining = this.remainingWords.length
  }

  skip () {
    const random = Math.floor(Math.random() * this.remainingWords.length)
    const previous = this.state.currentWord
    this.state.currentWord = _.pullAt(this.remainingWords, random)[0]
    this.remainingWords.push(previous)
  }

  restart () {
    this.remainingWords = this.wordBank.slice()

    const random = Math.floor(Math.random() * this.remainingWords.length)
    this.state.currentWord = _.pullAt(this.remainingWords, random)[0]
    this.state.score = 0
    this.state.remaining = this.remainingWords.length
    this.hide()
  }

  hide () {
    this.hidingWord = this.state.currentWord
    this.state.currentWord = undefined
  }

  show () {
    this.state.currentWord = this.hidingWord
  }

  update ({ wordBank, color }) {
    this.wordBank = wordBank
    this.color = color
    this.state.color = color
  }
}
