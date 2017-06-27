/**
 * Created by alonso134 on 5/30/2017.
 */
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './js/main.js',
    output: {
        filename: './js/build.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("./css/styles.css")
    ]
};