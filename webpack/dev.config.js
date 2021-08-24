import webpack from 'webpack';

export default {
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
            'process.env.NODE_ENV' : JSON.stringify('development'),
            'process.env.API_URL'  : JSON.stringify('http://localhost:5000/')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
};
