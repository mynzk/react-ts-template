/** @format */

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devConfig = {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './',
        host: 'localhost',
        port: 8090,
        historyApiFallback: true,
        overlay: {
            //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
            errors: true
        },
        inline: true,
        hot: true,
        proxy: {
            '/megatron': {
                target: 'http://10.15.9.110:8070/',
                //pathRewrite: {'^/megatron' : ''},
                changeOrigin: true,
            },
            // '/megatron': {
            //     target: 'https://zzebj.weshare.com.cn/',
            //     changeOrigin: true,
            // },
        },
    }
}

module.exports = merge(baseConfig, devConfig)


