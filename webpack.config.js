var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: fasle,
  entry: "./public/js/scripts.js",
  output: {
    path: __dirname + "/public/js",
    filename: "scripts.min.js" },
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};
