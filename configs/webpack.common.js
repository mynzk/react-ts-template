/** @format */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV.indexOf('dev') > -1;

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index'),
        vendor: ['react', 'react-dom']
    },
    output: {
        filename: '[name].[hash:8].js',
        chunkFilename: '[name].[hash:5].js',
        path: path.join(__dirname, '/dist'),
        publicPath: isDev ? '/' : './',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
        alias: {
            '@': path.join(__dirname, './src'),
            '@ant-design/icons/lib/dist$': path.join(__dirname, './src/icons.ts'),
            _images: path.join(__dirname, './src/styles/images')
        }
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                include: [path.join(__dirname, './src')],
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/, // 正则匹配文件路径
                exclude: /node_modules/,
                use: [
                    isDev ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        }
                    } ,
                    {
                        loader: 'css-loader', // 解析 @import 和 url() 为 import/require() 方式处理
                        options: {
                            importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                include: path.join(__dirname, './src'),
                use: [
                    isDev ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        }
                    } ,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.join(__dirname, './src/styles')]
                        }
                    }
                ]
            },
            {
                // for ant design
                test: /\.less$/,
                include: path.join(__dirname, './node_modules'),
                use: [
                    isDev ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        }
                    } ,
                    // {
                    //   loader: 'css-loader',
                    //   options: { localIdentName: '[name]__[local]--[hash:base64:5]' }
                    // },
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: {
                                // 'primary-color': 'black',
                                // 'border-radius-base': '10px'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //1024 == 1kb
                            //小于10kb时打包成base64编码的图片否则单独打包成图片
                            limit: 10240,
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            },
        ]
    },
}


