// const uglify = require('uglifyjs-webpack-plugin');
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const productionGzipExtensions = ['js', 'css'];
// const isDevelopment = process.env.NODE_ENV === 'development';
// //
// const entry = {
//   index: {
//     entry: 'src/pages/main.ts',
//     // 模板来源
//     template: 'public/index.html',
//     // 在 dist/index.html 的输出
//     filename: 'index.html',
//     // 当使用 title 选项时，
//     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
//     title: 'Index Page',
//     // 在这个页面中包含的块，默认情况下会包含
//     // 提取出来的通用 chunk 和 vendor chunk。
//     chunks: ['chunk-vendors', 'chunk-common', 'index']
//   }
//   // qiyuIndex: {
//   //   entry: 'src/qiyu-main.ts',
//   //   // 模板来源
//   //   template: 'public/qiyu-index.html',
//   //   // 在 dist/index.html 的输出
//   //   filename: 'qiyu-index.html',
//   //   // 当使用 title 选项时，
//   //   // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
//   //   title: '七鱼客服平台',
//   //   // 在这个页面中包含的块，默认情况下会包含
//   //   // 提取出来的通用 chunk 和 vendor chunk。
//   //   // chunks: ['chunk-vendors', 'chunk-common', 'index']
//   // }
// }
// module.exports = {
//     pages: entry
// }
// // if (!isDevelopment) {
// //   module.exports = {
// //     pages: entry,
// //     baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
// //     pwa: {
// //       name: 'vue-order-admin'
// //     },
// //     configureWebpack: {
// //       // 压缩并重命名js文件
// //       plugins: [
// //         new uglify(),
// //         new CompressionWebpackPlugin({
// //           algorithm: 'gzip',
// //           test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
// //           threshold: 10240,
// //           minRatio: 0.8
// //         })
// //       ],
// //       output: {
// //         filename: '[name].[hash:5].js'
// //       },
// //       externals: {
// //         'vue': 'Vue',
// //         'vue-router': 'VueRouter'
// //         // 'element-ui': 'ELEMENT'
// //       }
// //     }
// //   }
// // } else {
// //   module.exports = {
// //     baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
// //     pwa: {
// //       name: 'vue-order-admin'
// //     },
// //     configureWebpack: {
// //       externals: {
// //         'vue': 'Vue',
// //         'vue-router': 'VueRouter'
// //         // 'element-ui': 'ELEMENT'
// //       }
// //     }
// //   }
// // };
// //
// // // https://blog.csdn.net/sunny_desmond/article/details/80916706 一篇说明文章

const entry = {
  index: {
    entry: 'src/pages/coocaa/main.ts',
    // 模板来源
    template: 'public/index.html',
    // 在 dist/index.html 的输出
    filename: 'index.html',
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'Index Page',
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  },
  qiyu:{
    entry: 'src/pages/qiyu/main.ts',
    template: 'public/qiyu.html',
    filename: 'qiyu.html',
    title: 'Qiyu Page',
    chunks: ['chunk-vendors', 'chunk-common', 'qiyu']
  }
}

module.exports = {
  pages: entry,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  pwa: {
    name: 'vue-order-admin'
  },
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter'
      // 'element-ui': 'ELEMENT'
      // 'vuex': 'Vuex'
    }
  }

}

