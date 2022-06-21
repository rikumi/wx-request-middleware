/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = {
  mode: 'production',
  performance: {
    hints: false,
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  // ref https://github.com/remaxjs/remax/blob/master/packages/babel-preset-remax/src/index.ts
                  targets: ['chrome >= 49', 'firefox >= 64', 'ios >= 8', 'Android > 4.4'],
                }],
              ],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};
