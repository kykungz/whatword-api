import { possibles, length } from './variables'

export const generateRoomId = () => {
  let id = []
  for (let i = 0; i < length; i++) {
    id[i] = possibles.charAt(Math.random() * possibles.length)
  }
  return id.join('')
}

export const deconstructRoom = (room) => {
  if (!room) return room
  const { channel, ...subObject } = room
  return subObject
}
