const webpack = require('webpack');
const angularExternals = require('webpack-angular-externals');
const rxjsExternals = require('webpack-rxjs-externals');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    'ngx-stoui.umd': path.join(__dirname, 'index.ts'),
    'ngx-stoui.umd.min': path.join(__dirname, 'index.ts'),
    'styles': path.join(__dirname, '_ngx-stoui.scss')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundles/[name].js',
    libraryTarget: 'umd',
    library: 'ngxStoui'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader?keepUrl=false'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      /* Embed files. */
      {
        test: /\.(html)$/,
        loader: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      },
      {
        test: /\.(scss)$/,
        loaders: ['raw-loader', 'sass-loader'],
        exclude: /_ngx-stoui\.scss$/
      },
      {
        test: /_ngx-stoui\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'sass-loader']
        })
      },
      /* Async loading. */
      {
        test: /\.async\.(html|css|scss)$/,
        loaders: ['file?name=[name].[ext]', 'extract']
      }
    ]
  },
  devtool: 'source-map',
  externals: [
    angularExternals(),
    rxjsExternals()
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true
    }),
    new ExtractTextPlugin("[name].css"),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.join(__dirname, 'src')
    )
  ]
}