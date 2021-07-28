const webpack = require('webpack');

module.exports = {
    mode: 'production',
    devtool: 'source-map',

    output: {
        publicPath: 'dist/',
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('production')
        }),
    ],
};
