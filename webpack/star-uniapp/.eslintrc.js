/*
 * @Description:
 * @Author: shuliang
 * @Date: 2022-06-21 15:58:08
 * @LastEditTime: 2022-06-27 15:42:57
 * @LastEditors: shuliang
 */
module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true,
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    // eslint-config-prettier 的缩写
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: [],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    'vue/singleline-html-element-content': 'off',
    'vue/multiline-html-element-content': 'error',
    semi: 0,
  },
  globals: {
    uni: true,
    wx: true,
  },
}
