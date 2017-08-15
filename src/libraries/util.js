import { possibles, length } from './variables'

export const generateRoomId = () => {
  let roomId = []
  for (let i = 0; i < length; i++) {
    roomId[i] = possibles.charAt(Math.random() * possibles.length)
  }
  return roomId.join('')
}

export const deconstructRoom = (room) => {
  const { channel, ...subObject } = room
  return subObject
}
