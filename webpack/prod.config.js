import webpack from 'webpack';

export default {
    mode: 'production',
    devtool: 'source-map',

    output: {
        publicPath: '/dist/',
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('production'),
            'process.env.API_URL'  : JSON.stringify('https://server-dot-medg-research-general.uc.r.appspot.com/')
        }),
    ],
};
