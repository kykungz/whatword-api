require('babel-core/register');
require('babel-polyfill');

const ip = require('ip');

const PORT = process.env.PORT || 8080
const env = process.env.NODE_ENV || 'development'
const src = env === 'production' ? './build/server' : './src/server'

const server = require(src).default;


server.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${PORT}`)
})
