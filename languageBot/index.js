const express = require('express')
const bodyParser = require('body-parser')
const recastai = require('recastai').default

const replyMessage = require('./message')

// Instantiate Recast.AI SDK
const client = new recastai('a0ab2ca7d6b2d65856e92c0952609a34')

// Start Express server
const app = express()
app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json())

// Handle / route
app.use('/', (request, response) => {

  // Call bot main function
  if (request.body.message) {
      /*
      * Call the Recast.AI SDK function to handle message from Bot Connector
      * This function will:
      * - Return a response with the status code 200
      * - Create a Message object, easily usable in your code
      * - Call the 'replyMessage' function, with this Message object in parameter
      *
      * If you want to edit the behaviour of your code bot, depending on user input,
      * go to /src/message.js file and write your own code under "YOUR OWN CODE" comment.
      */
      const body = request.body
      client.connect.handleMessage({ body }, response, replyMessage)
  
      /*
        * This function is called by Recast.AI hosting system when your code will be hosted
        */
      response.status(200).json({ result: 'Bot answered :)' })
    } else if (request.body.text) {
      /*
      * If your request comes from the testing route
      * ie curl -X "POST" "https://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
      * It just sends it to Recast.AI and returns replies
      */
      client.request.converseText(request.body.text, { conversationToken: process.env.CONVERSATION_TOKEN || null })
        .then((res) => {
          if (res.reply()) {
            /*
              * If response received from Recast.AI contains a reply
              */
            response.status(200).json({
              reply: res.reply(),
              conversationToken: res.conversationToken,
            })
          } else {
            /*
              * If response received from Recast.AI does not contain any reply
              */
            response.status(200).json({
              reply: 'No reply :(',
              conversationToken: res.conversationToken,
            })
          }
        })
        .catch((err) => {
          response.sendStatus(400)
        })
    } else {
      callback('No text provided')
    }

})

// Run Express server, on right port
app.listen(app.get('port'), () => {
  console.log('Our bot is running on port', app.get('port'))
})
