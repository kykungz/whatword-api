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
    if (!wordBank || !wordBank.length) {
      next(new InvalidForm('Word Bank is empty!'))
    } else if (!password || !password.length) {
      next(new InvalidForm('Password is empty!'))
    } else {
      let room = game.create(wordBank, password)
      room.channel = io.in(room.id)
      res.send(room.id)
    }
  } catch (err) {
    next(err)
  } finally {
    console.log(game.rooms.map((room) => {
      return deconstructRoom(room)
    }))
  }
})

app.post('/update', (req, res, next) => {
  const wordBank = req.body.wordBank
  const id = req.body.id
  const password = req.body.password
  const room = game.getRoom(id)

  if (!room) {
    next(new GameNotFound())
    return
  }

  if (room.auth(password)) {
    room.wordBank = wordBank
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

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  })

  socket.on('join', (data) => {
    let id = data.id
    let room = game.getRoomInfo(id)
    socket.join(id)
    socket.emit('state', room.state)
    console.log('join', data)
  })

  socket.on('status', (data) => {
    console.log('status', data)
  })

  socket.on('remote', (data) => {
    console.log('remote', data)
    const room = game.getRoom(data.id)

    if (!room || !room.auth(data.password)) return

    switch (data.action) {
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
        room.show()
        break
      case 'restart':
        room.restart()
        break
      default:
    }
  })
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.send(err.message || 'error')
})

export default server
