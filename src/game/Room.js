function Room (words) {
  this.id = generateRoomId()
  this.wordBank = words
  this.remainingWords = this.wordBank.slice()
  this.state = {
    currentWord: undefined,
    score: 0
  }
}

Room.prototype.correct = () => {
  let randomIndex = Math.floor(Math.random() * this.remainingWords.length)
  this.state.currentWord = this.remainingWords.splice(randomIndex, 1)[0]
  this.state.score++
  this.channel.emit(this.id, this.state)
}

Room.prototype.skip = () => {
  let randomIndex = Math.floor(Math.random() * this.remainingWords.length)
  this.state.currentWord = this.remainingWords[randomIndex]
  this.channel.emit(this.id, this.state)
}

Room.prototype.reset = () => {
  this.remainingWords = this.wordBank.slice()
  this.state.currentWord = undefined
  this.state.score = 0
  this.channel.emit(this.id, this.state)
}

Room.prototype.setChannel = (channel) => {
  this.channel = channel
}

export default Room
