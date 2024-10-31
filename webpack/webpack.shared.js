const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (entry) => ({
    mode: 'production',
    entry: entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                resourceQuery: /raw/,
                type: 'asset/source',
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new Dotenv({
            path: '../.env',
        }),
    ],
});
