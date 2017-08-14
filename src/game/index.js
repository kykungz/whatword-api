import { generateRoomId } from '../libraries/util'
import Room from './Room'

const game = {
  rooms: [],
  create (words) {
    let room = new Room(words)
    this.rooms.push(room)
    return room
  },
  remove (id) {
    this.rooms.splice(rooms.indexOf(id),1)
  }

}

export default game
