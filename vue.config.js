const uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
  pwa: {
    name: 'vue-order-admin'
  },
  configureWebpack:{
    plugins:[
      new uglify()
    ],
    output:{
      filename: '[name].[hash:5].js'
    }
  }
}
// https://blog.csdn.net/sunny_desmond/article/details/80916706 一篇说明文章
