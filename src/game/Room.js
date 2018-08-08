import { generateRoomId } from '../libraries/util'

export default class Room {
  constructor ({ wordBank, color, password }) {
    this.id = generateRoomId()
    this.password = password
    this.wordBank = wordBank.slice()
    this.remainingWords = wordBank.slice()
    this.color = color
    this.state = {
      id: this.id,
      currentWord: undefined,
      score: 0,
      remaining: wordBank.length,
      color: this.color
    }
  }

  auth (password) {
    return this.password === password
  }

  correct () {
    const randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
    this.state.score++
    this.state.remaining = this.remainingWords.length
  }

  skip () {
    const randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    if (this.state.currentWord) {
      this.remainingWords.push(this.state.currentWord)
    }
    this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
    this.state.remaining = this.remainingWords.length
  }

  restart () {
    this.remainingWords = this.wordBank.slice()
    this.state.currentWord = undefined
    this.state.score = 0
    this.state.remaining = this.remainingWords.length
  }

  hide () {
    this.remainingWords.push(this.state.currentWord)
    this.state.currentWord = undefined
    this.state.remaining = this.remainingWords.length
  }

  update ({ wordBank, color }) {
    this.wordBank = wordBank
    this.color = color
    this.state.color = color
  }
}
