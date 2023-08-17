// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";


const config = {
    entry: ['./client/index.jsx'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        open: true,
        host: "localhost",
      },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
        }),
        
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ['@babel/env','@babel/preset-react'] },
              },
            {
                test: /\.css$/i,
                use: [ stylesHandler, 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            // {
            //     test: /\.(jpg|jpeg|png|gif)$/,
            //     use: ['file-loader']
            //   }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".jsx", ".js", "..."],
      },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new MiniCssExtractPlugin());
        
    } else {
        config.mode = 'development';
    }
    return config;
};
