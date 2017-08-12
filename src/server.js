import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'
import game from './game'

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/create', (req, res, next) => {
  const words = req.body.words
  let roomId = game.create(words)
  res.send(roomId)
})


io.on('connection', (socket) => {
  socket.on('player', (data) => {
    let roomId = data.roomId
    let room = game.rooms[game.rooms.indexOf(roomId)]
    if (room) {

    }
  })
})

export default server
