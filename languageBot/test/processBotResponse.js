const processBotResponse = require('../app/talkToBot').processBotResponse
const chai = require('chai')
const codeHTTP = require('../constant/')

const testMessages = require('./testConstants').testMessages
const goodTestIdentifications = require('./testConstants').goodTestIdentifications

describe('#processBotResponse' , function() {

  const tests = [
    {
      expectedCodeHTTP: codeHTTP.NOT_FOUND,
      senderId: 1234545212,
      messageReply: 'yeah',
      conversationId: 12455445,
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.NOT_FOUND}`
    },
    {
      expectedCodeHTTP: codeHTTP.NOT_FOUND,
      senderId: 1234545212,
      messageReply: 'yeah',
      conversationId: 12455445,
      language: 'frefreref',
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.NOT_FOUND}`
    },
    {
      expectedCodeHTTP: codeHTTP.SUCCESS,
      senderId: goodTestIdentifications.telegramGoodSenderId,
      messageReply: 'bonjour',
      conversationId: goodTestIdentifications.telegramGoodConversationId,
      language: 'fr',
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.SUCCESS} if language is in french`
    },
    {
      expectedCodeHTTP: codeHTTP.SUCCESS,
      senderId: goodTestIdentifications.telegramGoodSenderId,
      messageReply: 'bcdscdsfvvfd',
      conversationId: goodTestIdentifications.telegramGoodConversationId,
      language: 'fr',
      testDescription: `${testMessages.shouldRespond} ${codeHTTP.SUCCESS} even if the message sent does'nt have any meaning`
    }
  ]

  function handleErrors(promise) {
    return promise.catch((err) => {
      if (err.statusCode == 400 || err.statusCode == 404) {
        return err
      }
      throw err
    })
  }

  tests.forEach(function(test) {

    it(test.testDescription, async function() {
      const res = await handleErrors(processBotResponse(test.senderId, test.messageReply, test.conversationId))

      if (test.expectedCodeHTTP === 200) {
        return chai.assert.strictEqual(res.message, 'Messages successfully posted')
      } else {
        return chai.assert.strictEqual(res.response.body.message, 'Conversation not found')
      }
    })
  })
})