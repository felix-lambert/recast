const request = require('request-promise-native')

const codeHTTP = require('../constant/')

const recastAPIURL = 'https://api.recast.ai'
const recastToken = 'a0ab2ca7d6b2d65856e92c0952609a34'

const setHeader = {
  'Authorization': `Token ${recastToken}`
}

function sendToRecast(url, jsonData) {
  return request.post(url, {
    json: jsonData,
    headers: setHeader
  })
}

const processBotResponse = (senderId, textMessageToSendToBot, conversation, language = 'en') => (
  new Promise((resolve, reject) => {
    return sendToRecast(`${recastAPIURL}/v2/converse`, {
      text: textMessageToSendToBot,
      language: language,
      conversation_token: senderId
    }).then((convertToBotResponse) => {
      const botReply = convertToBotResponse.results.replies[0]

      return sendToRecast(`${recastAPIURL}/connect/v1/conversations/${conversation}/messages`, 
        { 
          messages: [{
            type: 'text',
            content: botReply
          }]
        }).then(sendDiscussionRes => resolve(sendDiscussionRes)
      ).catch(err => reject(err))
    }).catch(err => reject(err))
  })
)

const talkToBotMain = (req, response, next) => {
  if (req.body.message && req.body.message.conversation && req.body.senderId) {
    const { senderId, message } = req.body

    return processBotResponse(senderId, message.attachment.content, message.conversation)
      .then(res => response.status(codeHTTP.SUCCESS).json(res))
      .catch(err => {
        console.log('inside catch')
        return next(err)
      })
  } else {
    return next(new Error('Some data has not been provided'))
  }
}

module.exports = {
  talkToBotMain: talkToBotMain,
  processBotResponse: processBotResponse
}