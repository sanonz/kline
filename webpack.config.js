const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = function(env = {}, argv) {
    const IS_PRODUCTION = env.production;
    process.env.NODE_ENV = IS_PRODUCTION ? 'production' : 'development';

    const config = {
        entry: './src/entry.js',
        mode: process.env.NODE_ENV,
        devtool: IS_PRODUCTION ? false : 'source-map',
        output: {
            library: 'Kline',
            globalObject: 'this',
            path: path.resolve(__dirname, 'dist'),
            filename: 'kline.js',
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            // hot: true,
            watchOptions: {
                poll: true,
            },
            host: '0.0.0.0',
            useLocalIp: true,
            historyApiFallback: true,
            before: function(app, server) {
                const mapping = ['mock', 'lines', 'depths', 'trades', 'listExchangePairInfo'];
                mapping.forEach(v => {
                    app.get(`/examples/${v}.json`, function(req, res) {
                        setTimeout(function() {
                            res.json(require(`./examples/${v}.json`));
                        }, 1000);
                    });
                });
            },
        },
        plugins: [
            new VueLoaderPlugin(),    
        ],
        resolve: {
            extensions: ['.vue', '.js'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
            },
        },    
        externals: {
            jquery: 'jQuery',
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'vue-loader',
                    },
                },    
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                'transform-class-properties'
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true,
                                cssModules: {
                                    localIdentName: IS_PRODUCTION ? '[hash:base64]' : '[local]-[hash:base64]',
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true,
                                cssModules: {
                                    localIdentName: IS_PRODUCTION ? '[hash:base64]' : '[local]-[hash:base64]',
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                indentedSyntax: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }
            ]
        }
    };

    if (IS_PRODUCTION) {
        config.entry = './src/components/Chart';
        config.output.libraryTarget = 'commonjs2';
        config.externals = {
            axios: {
                commonjs: 'axios',
                commonjs2: 'axios',
                amd: 'axios',
                root: 'axios',
            },
        };
    } else {
        config.plugins.push(new HtmlWebpackPlugin({
            filename: './index.html',
            template: './index.tpl.html',
            minify: IS_PRODUCTION ? htmlMinify : false,
        }));
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};

