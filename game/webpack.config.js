const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.js',
  output: {
    // Prefix dev builds with dev. to ignore it
    filename: argv.mode === 'development' ? 'dev.[name].js' : '[name].js?hash=[contenthash]',
    path: path.resolve(__dirname, '..', 'docs', argv.mode === 'development' ? 'dev.assets' : 'assets'),
    pathinfo: false,
    publicPath: argv.mode === 'development' ? 'dev.assets/' : 'assets/',
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : '',
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  watch: argv.mode === 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      }, {
        test: /\.png$/,
        loader: 'file-loader'
      },
    ]
  },
  optimization: {
    minimizer: argv.mode === 'development' ? [] : [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      filename: path.resolve(__dirname, '..', 'docs', (argv.mode === 'development' ? 'dev.' : '') + 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: argv.mode === 'development' ? 'dev.[name].css' : '[name].css?hash=[contenthash]'
    })
  ]
});