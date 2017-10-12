const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../index')
const codeHTTP = require('../constant/')
const testMessages = require('./testConstants')

const localURL = `http://localhost:${server.get('port')}`
const telegramGoodConversationId = '7b603af4-1096-43f5-8cef-4784fe14893a'
const telegramGoodSenderId = '464387541'

const hasBeenProvided = 'has been provided'

const shouldBadRequestTestMessage = `${testMessages.shouldRespond} ${codeHTTP.BAD_REQUEST} ${testMessages.toPost} ${testMessages.when}`

chai.use(chaiHttp)

describe('api', function() {

  let app
  beforeEach(function(done) {
    // beforeEach hook
    app = server.listen(server.get('port'), function(err) {
      done(err)
    })
  })

  afterEach(function(done) {
    // beforeEach hook
    app.close(function(err) {
      done(err)
    })
  })

  describe('#app.post express routes' , function() {

    const data = 'data'
    const no = 'no'
    const conversationId = 'conversationId'
    const senderId = 'senderId'

    const tests = [
      {
        expectedCodeHTTP: codeHTTP.BAD_REQUEST,
        dataToSend: {},
        path: '/',
        testDescription: `${shouldBadRequestTestMessage} ${no} ${data} ${hasBeenProvided}`
      },
      {
        expectedCodeHTTP: codeHTTP.BAD_REQUEST,
        dataToSend: { 
          message: { 
            attachment: { content: 'hello' }
          },
          senderId: telegramGoodSenderId
        },
        path: '/',
        data: conversationId,
        testDescription: `${shouldBadRequestTestMessage} ${no} ${conversationId} ${hasBeenProvided}`
      },
      {
        expectedCodeHTTP: codeHTTP.BAD_REQUEST,
        dataToSend: { 
          message: { 
            attachment: { content: 'hello' }
          }
        },
        data: senderId,
        testDescription: `${shouldBadRequestTestMessage} ${no} ${senderId} ${hasBeenProvided}`,
        path: '/'
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
      it(test.testDescription, function(done) {
        chai.request(`${localURL}`).post(test.path).send(test.dataToSend)
          .then(function(response) {
            chai.assert.strictEqual(response.body.message, 'Messages successfully posted')
            chai.assert.strictEqual(response.status, test.expectedCodeHTTP)
            done()
          })
          .catch(function(error) {
            chai.assert.strictEqual(error.status, test.expectedCodeHTTP)
            done()
          })
      })
    })
  })
})
