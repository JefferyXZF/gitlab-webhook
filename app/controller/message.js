'use strict'

const Controller = require('egg').Controller
const config = require('../../config/config')
const redis = require('redis');
const client = redis.createClient( 6379, '127.0.0.1');

class MessageController extends Controller {
  async messageSwitch() {
    const { ctx } = this
    const query = ctx.query
    let errMsg = null
    console.log(query)
    if(query.status === 'close') {
      client.set('gitlabHookSend', query.status, function(err, obj) {
        errMsg = err
        console.log(obj)
      })
      client.expire('gitlabHookSend',60*60);
    }
    
    if(errMsg) {
      ctx.body = `执行失败，请重新执行！失败原因:${errMsg}`
    }
    ctx.body = `执行成功！当前消息推送状态已${query.status === 'open' ? '开启': '关闭'}`
  }
}

module.exports = MessageController
