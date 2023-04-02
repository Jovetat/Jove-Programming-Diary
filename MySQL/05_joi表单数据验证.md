# joi 表单数据验证

` 后端作为数据合法性验证的最后一个关口，务必要做到拦截非法数据`

## 第三方数据验证模块 joi

` 安装 joi 包，为表单中携带的每个数据项定义验证规则`

```
npm install joi
```

## 通过中间件的方式使用表单验证

` validate.js`

``` js
const Joi = require('joi')

// 定义表单判断的中间件
const validateForm = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      res
        .status(400)
        .send({ message: '表单数据不合法', details: error.details })
    } else {
      next()
    }
  }
}

// 定义注册表单的验证模式
const regJoi = Joi.object({
  nickname: Joi.string().min(1).max(14).required(),
  cellphone: Joi.string()
    .pattern(
      new RegExp(
        '^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])d{8}$',
      ),
    )
    .required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
})

module.exports = {
  regJoi,
  validateForm,
}
```

` 在路由中使用表单验证`

``` js
const { regUser, login, logout } = require('../utils/user_handler')
router.post('/reguser', validateForm(regJoi), regUser)
```

