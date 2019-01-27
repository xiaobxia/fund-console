var path = require('path')
var utils = require('./utils')
var config = require('../config')
var os = require('os');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

const ifCdn = process.env.NODE_ENV === 'production' && config.build.ifCdn;

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.ifCdn ? config.build.cdnPublicPath : config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    //对jsx的支持
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
      //通过module引入
      'localRoutes': path.resolve(__dirname, '../src/routes'),
      'localUtil': path.resolve(__dirname, '../src/util'),
      'localComponent': path.resolve(__dirname, '../src/components'),
      'localStore': path.resolve(__dirname, '../src/store')
    }
  },
  plugins: [
    new HappyPack({
      id: 'happyBabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  module: {
    rules: [
      {
        //对jsx的支持
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          //自动修复
          fix: true
        }
      },
      //babel-loader很慢，要做好优化
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBabel',
        include: [resolve('src'), resolve('test')],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('img/[name].[hash:7].[ext]')
          name: ifCdn ? utils.assetsPath('[name].[hash:7].[ext]') : utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('media/[name].[hash:7].[ext]')
          name: ifCdn ? utils.assetsPath('[name].[hash:7].[ext]') : utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          name: ifCdn ? utils.assetsPath('[name].[hash:7].[ext]') : utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
};
