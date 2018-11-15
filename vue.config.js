const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new SpriteLoaderPlugin()
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('svg-sprite-loader')
      .options({
        extract: true,
        spriteFilename: 'sprite-[hash:6].svg'
      })
  }
}