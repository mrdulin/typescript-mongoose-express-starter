import * as webpack from 'webpack';
import * as path from 'path';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import nodeExternals = require('webpack-node-externals');

const config: webpack.Configuration = {
  target: 'node',
  devtool: 'source-map',
  entry: path.resolve(__dirname, './src/main.ts'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    pathinfo: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      models: path.resolve(__dirname, 'src/models'),
    },
  },
  plugins: [new CopyWebpackPlugin([{ from: './src/views', to: 'views' }, { from: './src/public', to: 'public' }])],
  externals: [nodeExternals()],
};

export default config;
