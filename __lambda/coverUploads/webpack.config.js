const isProd = true;
const path = require("path");

module.exports = {
  entry: {
    main: "./index.js"
  },
  target: "node",
  output: {
    filename: "index-bundle.js",
    path: path.resolve(__dirname, "xxx")
  },
  resolve: {
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: []
  },
  externals: ["aws-sdk"],
  //output: { libraryTarget: "commonjs2" }
};