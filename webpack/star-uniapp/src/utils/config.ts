// 项目配置
const baseUrlObj = {
  dev: 'http://10.0.192.29:19000',
  test: 'http://10.0.192.29:18000',
  release: 'http://192.18.0.200:80',
  prod: 'http://yihe.yixingdianzi.com:8000',
}
const updateObj = {
  dev: '',
  test: '',
  release: '',
  prod: '',
}
const productionObj = {
  dev: '开发环境',
  test: '测试环境',
  release: '现场测试',
  prod: '生产环境',
}

const develop = 'dev'

const baseUrl = baseUrlObj[develop]
const update = updateObj[develop]
const production = productionObj[develop]
const versionUrl = 'https://appsapi.seepine.com/v1/check'

export { baseUrl, update, production, versionUrl }
