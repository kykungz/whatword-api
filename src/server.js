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
      return {id:room.id, password:room.password, wordBank:room.wordBank, remainingWords:room.remainingWords, state:room.state}
    }))
  }
})

app.get('/room', (req, res, next) => {
  const id = req.query.id
  const room = game.getRoom(id)
  if (room) {
    res.send(room.state)
  } else {
    next(new Error('Game not found'))
  }
})

io.on('connection', (socket) => {
  socket.on('disconnect', ()  => {

  })
  socket.emit('hi', 'this is asdfasdfasfdasdf')
  socket.on('play', (data) => {
    let roomId = data.roomId
    let room = game.getRoom(roomId)
    socket.join(roomId)
    socket.emit('state', room.state)
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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.send(err.message || 'error')
})

export default server
