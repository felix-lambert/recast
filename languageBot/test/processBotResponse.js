const processBotResponse = require('../app/talkToBot').processBotResponse
const chai = require('chai')
const codeHTTP = require('../constant/')

const testMessages = require('./testConstants')

const telegramGoodConversationId = '7b603af4-1096-43f5-8cef-4784fe14893a'
const telegramGoodSenderId = '464387541'

describe('#processBotResponse' , function() {

  const butTestSucceeded = 'but test succeeded'
  const successResponseFromRecastAPI = 'Messages successfully posted'

  const tests = [
    {
      expectedCodeHTTP: codeHTTP.BAD_REQUEST,
      dataToSend: {},
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.NOT_FOUND}`
    },
    {
      expectedCodeHTTP: codeHTTP.BAD_REQUEST,
      dataToSend: {},
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.BAD_REQUEST}`
    },
    {
      expectedCodeHTTP: codeHTTP.BAD_REQUEST,
      dataToSend: {},
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.SUCCESS} if language is in french`
    },
    {
      expectedCodeHTTP: codeHTTP.SUCCESS,
      dataToSend: { 
        message: { 
          conversation: telegramGoodConversationId,
          attachment: { content: 'hello' }
        },
        senderId: telegramGoodSenderId
      },
      data: senderId,
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.SUCCESS} ${testMessages.toPost} ${testMessages.when} all necessary data ${hasBeenProvided}`,
      path: '/'
    },
    {
      expectedCodeHTTP: codeHTTP.NOT_FOUND,
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.NOT_FOUND} ${testMessages.toPost} at /foo ${testMessages.when} route is not found`,
      path: '/foo'
    }
  ]

  tests.forEach(function(test) {

  })

  it(``, function(done) {
    processBotResponse(1234545212, 'yeah', 12455445)
      .then(() => {
        done(`${testMessages.shouldRespond} ${codeHTTP.NOT_FOUND} ${butTestSucceeded}`)
      })
      .catch(error => {
        chai.assert.deepEqual(error.statusCode, codeHTTP.NOT_FOUND)
        done()
      })
  })

  it(``, function(done) {
    processBotResponse(1234545212, 'yeah', 12455445, 'frefreref')
      .then(() => {
        done(`${testMessages.shouldRespond} ${codeHTTP.BAD_REQUEST} ${butTestSucceeded}`)
      })
      .catch(error => {
        chai.assert.deepEqual(error.statusCode, codeHTTP.BAD_REQUEST)
        done()
      })
  })

  it(``, function(done) {
    processBotResponse(telegramGoodSenderId, 'bonjour', telegramGoodConversationId, 'fr')
      .then((res) => {
        chai.assert.deepEqual(res.message, successResponseFromRecastAPI)
        done()
      })
      .catch(() => {
        done(`${testMessages.shouldRespond} ${codeHTTP.SUCCESS} but test failed`)
      })
  })

  it(`${testMessages.shouldRespond} ${codeHTTP.SUCCESS} even if the message sent does'nt have any meaning`, function(done) {
    processBotResponse(telegramGoodSenderId, 'bcdscdsfvvfd', telegramGoodConversationId, 'fr')
      .then((res) => {
        chai.assert.deepEqual(res.message, successResponseFromRecastAPI)
        done()
      })
      .catch(() => {
        done('error should return success')
      })
  })

  // it.only(`${testMessages.shouldRespond} ${codeHTTP.SUCCESS} even if the message sent is in the wrong language`, function(done) {
  //   processBotResponse(telegramGoodSenderId, 'salut', telegramGoodConversationId, 'en')
  //     .then((res) => {
  //       chai.assert.deepEqual(res.message, 'Messages successfully posted')
  //       done()
  //     })
  //     .catch((error) => {
  //       console.log('error')
  //       console.log(error)
  //       done()
  //     })
  // })
})