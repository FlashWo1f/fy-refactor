import $axios, { get } from "./request"

// 启用/禁用活动

// 发送邮件
export function sendEmail(params) {
  return $axios.post("/hr/activity/email/send", {
    ...params,
  })
}
// 获取邮件模板
export function downTemplate(id) {
  return get(`/hr/activity/${id}/get/email/template`)
}
const email = {
  downTemplate,
  sendEmail,
}

export default email
