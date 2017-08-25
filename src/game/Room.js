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
      hiding: false
    }
  }

  auth (password) {
    return this.password === password
  }

  correct () {
    console.log('correct called')
    let randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    this.state.hiding = false
    this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
    this.state.score++
    this.channel.emit('state', this.state)
  }

  skip () {
    let randomIndex = Math.floor(Math.random() * this.remainingWords.length)
    this.state.hiding = false
    this.state.currentWord = this.remainingWords[randomIndex]
    this.channel.emit('state', this.state)
  }

  restart () {
    this.remainingWords = this.wordBank.slice()
    this.state.hiding = false
    this.state.currentWord = undefined
    this.state.score = 0
    this.channel.emit('state', this.state)
  }

  hide () {
    this.state.hiding = true
    this.state.currentWord = undefined
    this.channel.emit('state', this.state)
  }

  show () {
    this.state.hiding = false
    this.skip()
  }
}
