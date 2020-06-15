/** @format */
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.common')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')


const nodeEnv = process.env.NODE_ENV;
let configSetting = '';
console.log(nodeEnv);
if (nodeEnv.indexOf('pro') > -1) {
    configSetting = fs.readFileSync(path.resolve(__dirname, 'src/config/config-pro.ts'), { encoding: 'utf8' });
} else if (nodeEnv.indexOf('release') > -1) {
    configSetting = fs.readFileSync(path.resolve(__dirname, 'src/config/config-release.ts'), { encoding: 'utf8' });
}
fs.writeFileSync(path.resolve(__dirname, 'src/config/index.ts'), configSetting);

// const workboxPlugin = require('workbox-webpack-plugin')
const DLL_PATH = './dll'

const prodConfig = {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        // 性能配置
        runtimeChunk: true, // 开启 manifest 缓存，每个入口单独创建
        moduleIds: 'hashed',
        splitChunks: {
            chunks: 'async', // 提取的 chunk 类型，all: 所有，async: 异步，initial: 初始
            // minSize: 30000, // 默认值，新 chunk 产生的最小限制 整数类型（以字节为单位）
            // maxSize: 0, // 默认值，新 chunk 产生的最大限制，0为无限 整数类型（以字节为单位）
            // minChunks: 1, // 默认值，新 chunk 被引用的最少次数
            // maxAsyncRequests: 5, // 默认值，按需加载的 chunk，最大数量
            // maxInitialRequests: 3, // 默认值，初始加载的 chunk，最大数量
            // name: true, // 默认值，控制 chunk 的命名
            cacheGroups: {
                // 配置缓存组
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: 10, // 优先级
                    reuseExistingChunk: false, // 允许复用已经存在的代码块
                    test: /node_modules\/(.*)\.js/
                },
                common: {
                    name: 'common',
                    chunks: 'initial',
                    // test: resolve("src/components"), // 可自定义拓展你的规则
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                // parallel: true,
                terserOptions: {
                    compress: {
                        warnings: true,
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log'] // 移除console
                    }
                },
                sourceMap: true
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    reduceIdents: false,
                    autoprefixer: false,
                    safe: true,
                    discardComments: {
                        removeAll: true
                    }
                }
            })
        ]
    },
    performance: {
        // 性能提示，可以提示过大文件
        hints: 'warning', // 性能提示开关 false | "error" | "warning"
        maxAssetSize: 100000, // 生成的文件最大限制 整数类型（以字节为单位）
        maxEntrypointSize: 100000, // 引入的文件最大限制 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
            // 提供资源文件名的断言函数
            return /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetFilename)
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllReferencePlugin({
            manifest: path.join(__dirname, `${DLL_PATH}/vendor.manifest.json`)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        new AddAssetHtmlPlugin({
            filepath: path.join(__dirname, `${DLL_PATH}/**/*.js`),
            includeSourcemap: false
        }),
        new ScriptExtHtmlWebpackPlugin({
            //`runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[id].[contenthash].css'
        })
    ]
}

// if (config.bundleAnalyzerReport) {
//     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//     prodConfig.plugins.push(new BundleAnalyzerPlugin())
// }

module.exports = merge(baseConfig, prodConfig)

