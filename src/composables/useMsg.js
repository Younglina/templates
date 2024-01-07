import qrCode from '@/assets/icon/qrCode.svg'

function personMsg(v = {}) {
  let msg = ''
  if (1 === 1) {
    msg = '游客请先注册账号'
  }
  else {
    msg = `
    用户邮箱：${v.email || 'asdf@asdf.com'}<br>
    GPT会员类型：${v.vipType || '咖啡支持'}<br>
    GPT3.5：今日总次数${v.gpt35AllTimes || '88'}，今日剩余次数${v.gpt35LessTimes || '87'}<br>
    GPT4.0：总字数${v.gpt40LessTimes || '0'}，剩余字数${v.gpt40LessTimes || '0'}<br>
    普通AI绘画：总次数${v.normalAIDrawAllTimes || '5'}，剩余次数${v.normalAIDrawLessTimes || '4'}<br>
    MidJourney：总次数${v.MJAllTimes || '0'}，剩余次数${v.MJLessTimes || '0'}<br>
    GPT会员到期时间：${v.vipExpireTime || '2024-01-06 23:59:59'}<br>
  `
    return msg += '收藏永久域名发布页防止走丢：<br><a href="http://www.hellogptworld.com">http://www.hellogptworld.com</a>'
  }
  return `
    用户邮箱：${v.email || 'asdf@asdf.com'}<br>
    GPT会员类型：${v.vipType || '咖啡支持'}<br>
    GPT3.5：今日总次数${v.gpt35AllTimes || '88'}，今日剩余次数${v.gpt35LessTimes || '87'}<br>
    GPT4.0：总字数${v.gpt40LessTimes || '0'}，剩余字数${v.gpt40LessTimes || '0'}<br>
    普通AI绘画：总次数${v.normalAIDrawAllTimes || '5'}，剩余次数${v.normalAIDrawLessTimes || '4'}<br>
    MidJourney：总次数${v.MJAllTimes || '0'}，剩余次数${v.MJLessTimes || '0'}<br>
    GPT会员到期时间：${v.vipExpireTime || '2024-01-06 23:59:59'}<br>
    收藏永久域名发布页防止走丢：<br><a href="http://www.hellogptworld.com">http://www.hellogptworld.com</a>
  `
}

function customeServiceMsg(v = {}) {
  return `
    客服QQ：${v.email || '1231231231'}<br>
    防走丢请加QQ群：${v.email || '1231231231'}<br>
    <img src=${qrCode} />
  `
}

const msgByTime = {
  person: { fnc: personMsg, title: '个人中心' },
  customeService: { fnc: customeServiceMsg, title: '联系客服' },
}
export function altMsgBox(type) {
  ElMessageBox.alert(msgByTime[type].fnc(), msgByTime[type].title, {
    showClose: false,
    showConfirmButton: false,
    dangerouslyUseHTMLString: true,
    closeOnClickModal: true,
    customClass: 'custom-msg-box',
  })
}
