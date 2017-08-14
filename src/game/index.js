import Room from './Room'

const game = {
  rooms: [],
  create (wordBank, password) {
    let room = new Room(wordBank, password)
    this.rooms.push(room)
    return room
  },
  remove (id) {
    this.rooms.splice(rooms.indexOf(id),1)
  },
  getRoom (id) {
    return this.rooms.find((room) => {
      return room.id === id
    })
  }
}

export default game
