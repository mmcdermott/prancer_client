const webpack = require('webpack');

module.exports = {
    mode: 'development',

    devtool: 'eval-cheap-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index',
    ],
    output: {
        publicPath: '/dist/',
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
        }),
    ],
};
