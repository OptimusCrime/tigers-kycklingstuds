const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

const buildPath = path.join(__dirname, 'build');
const sourcePath = path.join(__dirname, 'src');

module.exports = (env, argv) => {
  return {
    entry: './index.tsx',
    context: sourcePath,
    output: {
      clean: true,
      filename: 'static/[name].[contenthash].js',
      path: buildPath,
    },
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.json', '.js', '.jsx'],
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      port: 3000,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|site\.webmanifest|svg|icon|xml)$/i,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(sourcePath, 'index.html'),
        path: buildPath,
        filename: 'index.html',
        inject: 'head',
      }),
      new MiniCssExtractPlugin({
        filename: 'static/[name].[contenthash].css',
      }),
    ],
  };
};
