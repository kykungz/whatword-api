import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'
import game from './game'
import cors from 'cors'

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/create', (req, res, next) => {
  const words = req.body.words
  let room = game.create(words)
  room.setChannel(io.in(room.id))
  res.send(room.id)
})

io.on('connection', (socket) => {
  console.log('socket connected');
  socket.on('disconnect', ()  => {
    console.log('socket disconnected');
  })
  socket.emit('hi', 'this is asdfasdfasfdasdf')
  socket.on('play', (data) => {
    let roomId = data.roomId
    socket.join(roomId)
  })

  socket.on('status', (data) => {
    let roomId = data.roomId
    socket.join(roomId)
  })

  socket.on('remote', (data) => {
    let roomId = data.roomId
    socket.join(roomId)
  })
})

export default server
