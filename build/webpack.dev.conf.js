'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const mockData = require('./mock.js')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app) {
      app.post('/api/login', (req, res) => {
        res.json(
          mockData.login
        )
      })
      app.post('/api/register', (req, res) => {
        res.json(
          mockData.register
        )
      })
      app.post('/api/addconfig', (req, res) => {
        res.json(
          mockData.addConfig
        )
      })
      app.post('/api/config', (req, res) => {
        res.json(
          mockData.config
        )
      })
      app.post('/api/list', (req, res) => {
        res.json(
          mockData.list
        )
      }),
      app.post('/api/list/del', (req, res) => {
        res.json(
          mockData.delList
        )
      }),
      app.post('/api/list/search_date', (req, res) => {
        res.json(
          mockData.searchList
        )
      }),
      app.post('/api/list/add', (req, res) => {
        res.json(
          mockData.addList
        )
      }),
      app.post('/api/list/complete', (req, res) => {
        res.json(
          mockData.addCompleteList
        )
      }),
      app.post('/api/time/initial', (req, res) => {
        res.json(
          mockData.initialTime
        )
      }),
      // app.post('/api/time/done', (req, res) => {
      //   res.json(
      //     mockData.addTimeDone
      //   )
      // }),
      app.post('/api/time/quit', (req, res) => {
        res.json(
          mockData.addTimeQuit
        )
      }),
      app.post('/api/promo/add', (req, res) => {
        res.json(
          mockData.addPromo
        )
      }),
      app.post('/api/time/count', (req, res) => {
        res.json(
          mockData.addCountMins
        )
      }),
      app.get('/api/time/count', (req, res) => {
        res.json(
          mockData.countMins
        )
      }),
      app.post('/api/count/linechart', (req, res) => {
        res.json(
          mockData.countLineChart
        )
      }),
      app.post('/api/count/piechart', (req, res) => {
        res.json(
          mockData.countPieChart
        )
      }),
      app.post('/api/count/barchart', (req, res) => {
        res.json(
          mockData.countBarchart
        )
      }),
      app.post('/api/promo', (req, res) => {
        res.json(
          mockData.completedPromo
        )
      }),
      app.post('/api/promo/add', (req, res) => {
        res.json(
          mockData.addPromo
        )
      }),
      app.post('/api/promo/del', (req, res) => {
        res.json(
          mockData.delPromo
        )
      }),
      app.post('/api/list/completelist', (req, res) => {
        res.json(
          mockData.completeList
        )
      })
      app.post('/api/user/confirmpass', (req, res) => {
        res.json(
          mockData.confirmPass
        )
      }),
      app.post('/api/user/changepass', (req, res) => {
        res.json(
          mockData.changePass
        )
      }),
      app.post('/api/user/changecompletelist', (req, res) => {
        res.json(
          mockData.changeCompleteList
        )
      }),
      app.post('/api/list/delcompleteist', (req, res) => {
        res.json(
          mockData.delCompleteList
        )
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
