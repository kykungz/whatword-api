import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'
import game from './game'
import { deconstructRoom } from './libraries/util'

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
      res.status(400).send('Word Bank is empty!')
    } else if (!password || !password.length) {
      res.status(400).send('Password is empty!')
    } else {
      let room = game.create(wordBank, password)
      room.setChannel(io.in(room.id))
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

app.get('/room', (req, res, next) => {
  const id = req.query.id
  const password = req.query.password
  const room = game.getRoom(id)
  if (room) {
    if (password === room.password) {
      res.send({
        success: true,
        admin: true,
        room
      })
    } else {
      res.send({
        success: true,
        admin: false,
        room: room.state
      })
    }
    // res.send(password === room.password ? room : room.state)
  } else {
    next(new Error('Game not found!'))
  }
})

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  })

  socket.on('join', (data) => {
    let id = data.id
    let room = game.getRoom(id)
    socket.join(id)
    socket.emit('state', room.state)
  })

  socket.on('status', (data) => {
    let id = data.id
    socket.join(id)
  })

  socket.on('remote', (data) => {
    let id = data.id
    socket.join(id)
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
