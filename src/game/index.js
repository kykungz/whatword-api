import { deconstructRoom } from '../libraries/util'
import Room from './Room'

export default {
  rooms: [],
  create (options) {
    const room = new Room(options)
    this.rooms.push(room)
    return room
  },
  remove (id) {
    this.rooms.splice(this.rooms.indexOf(id), 1)
  },
  getRoomInfo (id) {
    const room = this.rooms.find((room) => {
      return room.id === id
    })
    return deconstructRoom(room)
  },
  getRoom (id) {
    const room = this.rooms.find((room) => {
      return room.id === id
    })
    return room
  }
}
