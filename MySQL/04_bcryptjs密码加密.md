# 对数据库密码进行加密处理

>   bcryptjs 密码加密的优点：
>
>   加密后的密码无法被逆向破解
>
>   同一明文密码多次加密，得到的加密结果各不相同，保证了安全性

## 安装 bcryptjs

``` 
npm i bcryptjs
```

## 使用 bcryptjs 进行加密

` 项目中引入 bcryptjs `

``` js
const bcrypt = require('bcryptjs')
```

` 对密码进行加密，随机盐可以提高密码的安全性`

``` js
bcrype.hashSync(明文密码, 随机盐的长度)
userinfo.password = bcrype.hashSync(userinfo.password, 10)
```

` 返回值为加密好的密码`