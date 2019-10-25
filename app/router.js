'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.post('/webhook', controller.home.webhook)
  router.get('/message', controller.message.messageSwitch)
}
