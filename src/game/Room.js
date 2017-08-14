import { generateRoomId } from '../libraries/util'

export default class Room {
  constructor (wordBank, password) {
    this.id = generateRoomId()
    this.password = password
    this.wordBank = wordBank.slice()
    this.remainingWords = wordBank.slice()
    this.state = {
      currentWord: undefined,
      score: 0
    }
  }

  setChannel (channel) {
    this.channel = channel
  }

  correct () {
    let randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
    this.state.score++
    this.channel.emit(this.id, this.state)
  }

  skip () {
    let randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    this.state.currentWord = this.remainingWords[randomIndex]
    this.channel.emit(this.id, this.state)
  }

  reset () {
    this.remainingWords = this.wordBank.slice()
    this.state.currentWord = undefined
    this.state.score = 0
    this.channel.emit(this.id, this.state)
  }

  hide () {
    this.state.currentWord = undefined
    this.channel.emit(this.id, this.state)
  }
}
