const path = require('path');

module.exports = {
  entry: './blackbird.js',
  mode: 'production',
  mode: 'development',
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
    },
    alias: {
      'handlebars-v4': 'handlebars-v4/dist/handlebars.js',
      'handlebars': 'handlebars/dist/handlebars.js'
    }
  },
};