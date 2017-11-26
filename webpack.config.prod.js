var path = require('path');

var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    zepto: ['n-zepto'],
    ['zepto.slide']: path.resolve(__dirname, './src/res/js/zepto.slide.js')
  },
  output: {
    path: path.resolve(__dirname, './demo'),
    filename: '[name].min.js'
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },

      {
        test: /\.less$/i,
        loader:  ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
          publicPath: '../'
        })
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },

      {
        test: /\.(png|jpg|gif|eot|svg|ttf|woff)$/,
        loader: 'url-loader?limit=8192&name=src/res/images/[name].[ext]?[hash:8]'
　　　},

      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: './demo.html',
      template: __dirname + '/src/demo.html',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      filename: './fullpage.html',
      template: __dirname + '/src/fullpage.html',
      inject: 'head'
    }),
    new ExtractTextPlugin('zepto.slide.min.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['zepto']
    }),
    new CleanWebpackPlugin(
      [
        'demo'
      ]
    )
  ]
};