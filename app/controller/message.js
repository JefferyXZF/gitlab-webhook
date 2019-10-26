'use strict'

const Controller = require('egg').Controller
const config = require('../../config/config')
// const redis = require('redis');
// const client = redis.createClient( 6379, '127.0.0.1');

class MessageController extends Controller {
  async messageSwitch() {
    const { ctx, app } = this
    const query = ctx.query
    const status = query.status
    ctx.logger.info('******** 修改消息推送状态-start *********')
    ctx.logger.info('修改状态为: %j', status)
    ctx.logger.info('******** 修改消息推送状态-end *********')
    let redisRes
      try {
        redisRes = await app.redis.set('gitlabHookSend', status === 'close' ? 'close' : '')
        if(status === 'close') {
          await app.redis.expire('gitlabHookSend', 1800)
        }
        
      } catch (error) {
        ctx.body = `执行失败，请重新执行！失败原因:${error}`
      }
    try {
      const res = await ctx.curl(config.webhook, {
        method: 'POST',
        contentType: 'json',
        data: {
          msgtype: 'markdown',
          markdown: {
            content: `当前消息推送状态已设置为${status === 'open' ? '开启': '关闭'}`
          }
        },
        dataType: 'json'
      })
    } catch (error) {
      ctx.body = `执行小助手失败！`
    }
    ctx.body = `执行成功！当前消息推送状态已${status === 'open' ? '开启': '关闭'}`
  }
}

module.exports = MessageController
