function Room (words) {
  this.id = generateRoomId()
  this.wordBank = words
  this.words = words.slice()
  this.current = undefined
  this.score = 0
}

Room.prototype.correct = () => {
  let randomIndex = Math.floor(Math.random() * this.words.length)
  this.current = this.words.splice(randomIndex, 1)[0]
}

Room.prototype.skip = () => {
  let randomIndex = Math.floor(Math.random() * this.words.length)
  this.current = this.words[randomIndex]
}

Room.prototype.reset = () => {
  this.words = this.wordBank.slice()
}

export default Room
