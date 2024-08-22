const axios = require('axios')
const nodemailer = require('nodemailer')

const pollTime = 60000

const API_URL = 'https://newsite.ricn-mall.com/api/product/detail/51' // 请求接口URL
const EMAIL_FROM = 'jove.qaq@qq.com' // 发件人邮箱
const EMAIL_PASSWORD = 'qsos******edgf' // 邮箱授权码
const EMAIL_TO = 'jove.qaq@qq.com' // 收件人邮箱
const EMAIL_TYPE = 'qq' // 发件人邮箱类型

let times = 0
let intervalId

async function checkStockAndSendEmail() {
  try {
    const response = await axios.get(API_URL)
    times += 1
    const data = response.data.data
    const stock = data?.storeInfo?.stock ?? 0
    process.stdout.write(`\r---require(${times})--- 剩余：${stock} `)
    if (stock > 0) {
      console.warn('补货了，发送邮件！')

      // 设置邮件传输
      let transporter = nodemailer.createTransport({
        service: EMAIL_TYPE, // 使用的邮件服务
        auth: {
          user: EMAIL_FROM,
          pass: EMAIL_PASSWORD,
        },
      })

      // 邮件内容
      let mailOptions = {
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject: '理光放货了！！！',
        text: `快tm的去抢，还有${stock}台`,
      }

      // 发送邮件
      let info = await transporter.sendMail(mailOptions)
      console.log('Email sent: ' + info.response)
      clearInterval(intervalId)
      console.log('已停止监控')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// 每60秒检查一次
intervalId = setInterval(checkStockAndSendEmail, pollTime)
