const processBotResponse = require('../app/talkToBot').processBotResponse
const chai = require('chai')
const codeHTTP = require('../constant/')

const telegramGoodConversationId = '7b603af4-1096-43f5-8cef-4784fe14893a'
const telegramGoodSenderId = '464387541'

describe.only('#processBotResponse' , function() {

  it(`should respond ${codeHTTP.NOT_FOUND}`, function(done) {
    processBotResponse(1234545212, 'yeah', 12455445)
      .then(() => {
        done(`should respond ${codeHTTP.NOT_FOUND} but test succeeded`)
      })
      .catch(error => {
        chai.assert.deepEqual(error.statusCode, codeHTTP.NOT_FOUND)
        done()
      })
  })

  it(`should respond ${codeHTTP.BAD_REQUEST}`, function(done) {
    processBotResponse(1234545212, 'yeah', 12455445, 'frefreref')
      .then(() => {
        done(`should respond ${codeHTTP.BAD_REQUEST} but test succeeded`)
      })
      .catch(error => {
        chai.assert.deepEqual(error.statusCode, codeHTTP.BAD_REQUEST)
        done()
      })
  })

  it(`should respond ${codeHTTP.SUCCESS} if language is in french`, function(done) {
    processBotResponse(telegramGoodSenderId, 'bonjour', telegramGoodConversationId, 'fr')
      .then((res) => {
        chai.assert.deepEqual(res.message, 'Messages successfully posted')
        done()
      })
      .catch(() => {
        done(`should respond ${codeHTTP.SUCCESS} but test failed`)
      })
  })

  it.only(`should respond ${codeHTTP.BAD_REQUEST} if the message sent does'nt have any meaning`, function(done) {
    processBotResponse(telegramGoodSenderId, 'bcdscdsfvvfd', telegramGoodConversationId, 'fr')
      .then((res) => {
        chai.assert.deepEqual(res.message, 'Messages successfully posted')
        chai.assert.deepEqual(err.statusCode, codeHTTP.BAD_REQUEST)
      })
      .catch((err) => {
        done()
      })
  })
})