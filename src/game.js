import { generateRoomId } from './libraries/util'

function Room (words) {
  this.id = generateRoomId()
  this.words = words
  this.score = 0
}

const game = {
  rooms: [],
  create (words) {
    this.rooms.push(new Room(words))
  },
  remove (id) {
    this.rooms.splice(rooms.indexOf(id),1)
  },
  correct () {

  },
  skip () {

  }

}

export default game
