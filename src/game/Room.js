import { generateRoomId } from '../libraries/util'

export default class Room {
  constructor (wordBank, password) {
    this.id = generateRoomId()
    this.password = password
    this.wordBank = wordBank.slice()
    this.remainingWords = wordBank.slice()
    this.state = {
      currentWord: undefined,
      score: 0,
      hiding: true,
      remaining: wordBank.length
    }
  }

  auth (password) {
    return this.password === password
  }

  correct () {
    const randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
    this.state.score++
    this.state.hiding = this.state.currentWord === undefined
    this.state.remaining = this.remainingWords.length
    this.channel.emit('state', this.state)
  }

  skip () {
    const randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    if (this.state.currentWord) {
      this.remainingWords.push(this.state.currentWord)
    }
    this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
    this.state.hiding = this.state.currentWord === undefined
    this.state.remaining = this.remainingWords.length
    this.channel.emit('state', this.state)
  }

  restart () {
    this.remainingWords = this.wordBank.slice()
    this.state.currentWord = undefined
    this.state.score = 0
    this.state.hiding = true
    this.state.remaining = this.remainingWords.length
    this.channel.emit('state', this.state)
  }

  hide () {
    this.remainingWords.push(this.state.currentWord)
    this.state.currentWord = undefined
    this.state.hiding = this.state.currentWord === undefined
    this.state.remaining = this.remainingWords.length
    this.channel.emit('state', this.state)
  }
}
