require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
const fs = require('fs')
const cdn = require('./cdn');
const baseDir = path.resolve(__dirname, '../dist');
const ifCdn = process.env.NODE_ENV === 'production' && config.build.ifCdn;

var spinner = ora('building for production...')
spinner.start()
if (ifCdn) {
  cdn.getCdnFileList().then((fileList) => {
    if (!fileList.length) {
      console.log('no file');
      return;
    }
    cdn.deleteCdnFile(fileList.map((item) => {
      return item.key;
    })).then(() => {
      console.log('all delete')
    });
  });
}
//TODO 只适合单页应用，因为它不删html，只删static
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    // if (ifCdn) {
    //   const promiseList = fs.readdirSync(baseDir).map(function (file) {
    //     return cdn.upload(path.resolve(baseDir, file), file);
    //   });
    //   Promise.all(promiseList).then(function () {
    //     console.log(chalk.cyan('  upload complete.\n'))
    //   })
    // }
  })
})
