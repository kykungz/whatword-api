import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'
import game from './game'

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/create', (req, res, next) => {
  console.log(req.body);
  const wordBank = req.body.wordBank
  const password = req.body.password
  let room = game.create(wordBank, password)
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
