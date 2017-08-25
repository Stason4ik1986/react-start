const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');

const isProd = process.env.NODE_ENV === 'production';
const cssExtract = new ExtractTextPlugin({
    filename: '[name].css',
    disable: !isProd,
    allChunks: true
});
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = cssExtract.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
        publicPath: DIST_DIR + '/app'
    });
const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: SRC_DIR + '/app/index.js',
    output: {
        path: DIST_DIR + '/app',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
                include: SRC_DIR,
                exclude: /node_modules/
            },
            {
                test: /\.sass$/i,
                use: cssConfig
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[hash].[ext]'
                        }
                    },
                    { loader: 'image-webpack-loader' }
                ]
            },
        ],
    },
    devServer: {
        contentBase: DIST_DIR + '/src/',
        open: true,
        compress: true,
        stats: 'minimal',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: SRC_DIR +'/index.html',
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/app/*.html')),
        }),
        cssExtract
    ],
};