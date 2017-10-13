const express = require('express')
const bodyParser = require('body-parser')
// Start Express server
const app = express()

const talkToBot = require('./app/talkToBot').talkToBotMain
const codeHTTP = require('./constant/')

require('./app/config/db')

app.set('port', 5000)

app.use(bodyParser.json())

// Handle / route
app.post('/', talkToBot)

// It's important to put at the end
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(codeHTTP.BAD_REQUEST).send({error: err.message})
  }
  return next()
})

if (require.main === module) {
  // Run Express server, on right port
  app.listen(app.get('port'), () => {
    console.log('Our bot is running on port', app.get('port'))
  })
} else {
  module.exports = app
}
