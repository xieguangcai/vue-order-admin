const uglify = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isDevelopment = process.env.NODE_ENV === 'development';

if (!isDevelopment) {
  module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    pwa: {
      name: 'vue-order-admin'
    },
    configureWebpack: {
      // 压缩并重命名js文件
      plugins: [
        new uglify(),
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      ],
      output: {
        filename: '[name].[hash:5].js'
      },
      externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter'
        // 'element-ui': 'ELEMENT'
      }
    }
  }
} else {
  module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    pwa: {
      name: 'vue-order-admin'
    },
    configureWebpack: {
      externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter'
        // 'element-ui': 'ELEMENT'
      }
    }
  }
};

// https://blog.csdn.net/sunny_desmond/article/details/80916706 一篇说明文章
