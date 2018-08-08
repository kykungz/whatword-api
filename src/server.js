import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'
import game from './game'
import { deconstructRoom } from './libraries/util'
import { GameNotFound, InvalidForm, Unauthorized } from './libraries/errors'

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/create', (req, res, next) => {
  try {
    const wordBank = req.body.wordBank
    const password = req.body.password.trim()
    const color = req.body.color

    if (!wordBank || !wordBank.length) {
      next(new InvalidForm('Word Bank is empty!'))
    } else if (!password || !password.length) {
      next(new InvalidForm('Password is empty!'))
    } else {
      let room = game.create({ wordBank, color, password })
      res.send(room.id)
    }
  } catch (err) {
    next(err)
  } finally {
    console.log(game.rooms.map(room => deconstructRoom(room)))
  }
})

app.post('/update', (req, res, next) => {
  const wordBank = req.body.wordBank
  const color = req.body.color
  const id = req.body.id
  const password = req.body.password
  const room = game.getRoom(id)

  if (!room) {
    next(new GameNotFound())
    return
  }

  if (room.auth(password)) {
    room.update({ wordBank, color })
    io.to(id).emit('state', room.state)
    res.send(deconstructRoom(room))
  } else {
    next(new Unauthorized('Wrong password!'))
  }
})

app.get('/room', (req, res, next) => {
  const id = req.query.id
  const password = req.query.password
  const room = game.getRoom(id)

  if (!room) {
    next(new GameNotFound())
    return
  }

  if (room.auth(password)) {
    res.send({
      admin: true,
      room: deconstructRoom(room)
    })
  } else {
    res.send({
      admin: false,
      room: room.state
    })
  }
})

app.post('/remote', (req, res, next) => {
  const { id, password, action } = req.body
  const room = game.getRoom(id)

  if (!room) {
    return next(new GameNotFound())
  }

  if (room.auth(password)) {
    switch (action) {
      case 'correct':
        room.correct()
        break
      case 'skip':
        room.skip()
        break
      case 'hide':
        room.hide()
        break
      case 'show':
        room.skip()
        break
      case 'restart':
        room.restart()
        break
      default:
    }
    io.to(id).emit('state', room.state)
    res.send({ success: true })
  } else {
    next(new Unauthorized('You dont have permission!'))
  }
})

io.on('connection', socket => {
  socket.on('disconnect', () => {})

  socket.on('join', data => {
    let id = data.id
    let room = game.getRoomInfo(id)
    socket.join(id)
    socket.emit('state', room.state)
  })
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal Server Error')
})

export default server
