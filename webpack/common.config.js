import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import { merge } from 'webpack-merge';

import precss from 'precss';

import development from './dev.config';
import production from './prod.config';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import fs from 'fs'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../src'),
    build: path.join(__dirname, '../dist'),
};

process.env.BABEL_ENV = TARGET;

const common = {
    target: 'web',
    entry: [
        PATHS.app,
    ],

    output: {
        path: PATHS.build,
        filename: 'bundle.js',
    },

    externals: {
      fs: fs,
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.ts', '.tsx', '.json', '.scss'],
        modules: ['node_modules', PATHS.app],
    },

    plugins: [new MiniCssExtractPlugin()],

    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&mimetype=application/font-woff',
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&mimetype=application/font-woff2',
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&mimetype=application/octet-stream',
            }, {
                test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&mimetype=application/font-otf',
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file',
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url?limit=10000&mimetype=image/svg+xml',
            }, {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
            },
            {
                test: /\.ts|\.tsx$/,
                use: ['babel-loader', 'ts-loader'],
                // include: __dirname,
            }, {
                test: /\.png$/,
                use: 'file?name=[name].[ext]',
            }, {
                test: /\.jpg$/,
                use: 'file?name=[name].[ext]',
            }
        ],
    },
};

let merged;
if (TARGET === 'start' || !TARGET) {
    merged = merge(development, common);
} else if (TARGET === 'build' || !TARGET) {
    merged = merge(production, common);
}

export default merged;
