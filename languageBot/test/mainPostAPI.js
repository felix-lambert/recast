const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../index')
const codeHTTP = require('../constant/')
const testMessages = require('./testConstants').testMessages
const goodTestIdentifications = require('./testConstants').goodTestIdentifications

const localURL = `http://localhost:${server.get('port')}`

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
          senderId: goodTestIdentifications.telegramGoodSenderId
        },
        path: '/',
        testDescription: `${shouldBadRequestTestMessage} ${no} conversation id ${hasBeenProvided}`
      },
      {
        expectedCodeHTTP: codeHTTP.BAD_REQUEST,
        dataToSend: { 
          message: { 
            attachment: { content: 'hello' }
          }
        },
        testDescription: `${shouldBadRequestTestMessage} ${no} sender id ${hasBeenProvided}`,
        path: '/'
      },
      {
        expectedCodeHTTP: codeHTTP.SUCCESS,
        dataToSend: { 
          message: { 
            conversation: goodTestIdentifications.telegramGoodConversationId,
            attachment: { content: 'hello' }
          },
          senderId: goodTestIdentifications.telegramGoodSenderId
        },
        testDescription: `${testMessages.shouldRespond} ${codeHTTP.SUCCESS} ${testMessages.toPost} ${testMessages.when} all necessary data ${hasBeenProvided}`,
        path: '/'
      },
      {
        expectedCodeHTTP: codeHTTP.NOT_FOUND,
        testDescription: `${testMessages.shouldRespond} ${codeHTTP.NOT_FOUND} ${testMessages.toPost} at /foo ${testMessages.when} route is not found`,
        path: '/foo'
      }
    ]

    function handleErrors(promise) {
      return promise.catch((err) => {
        if (err.status == 400 || err.status == 404) {
          return err
        }
        throw err
      })
    }

    tests.forEach(function(test) {
      it(test.testDescription, async function() {
        const res = await handleErrors(chai.request(`${localURL}`).post(test.path).send(test.dataToSend))
        if (test.expectedCodeHTTP === 200) {
          chai.assert.strictEqual(res.body.message, 'Messages successfully posted')
        } else {
          chai.assert.strictEqual(res.status, test.expectedCodeHTTP)
        }
      })
    })
  })
})
