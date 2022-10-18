const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'production',
  devtool: false,
  output: {
    filename: 'blackbird-handlebars.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'BlackbirdHandlebars',
  },
  resolve:
  {
    fallback: {
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url/")
    },
    alias: {
      'handlebars-v4': 'handlebars-v4/dist/handlebars.js',
      'handlebars': 'handlebars/dist/handlebars.js'
    }
  },
};