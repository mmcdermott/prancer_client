import { DEFAULT_PORT, SERVER_ADDRESS } from './constants.js';

import http from 'http';
import express from 'express';
import httpProxy from 'http-proxy';
import path from 'path';

import morgan from 'morgan';

import webpack  from 'webpack';
import webpackConfig from './webpack/common.config.js';
import wdm from 'webpack-dev-middleware';
import whm from 'webpack-hot-middleware';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const proxy = httpProxy.createProxyServer({});

const app = express();

app.use(morgan('short'));

(function initWebpack() {
    const compiler = webpack(webpackConfig);

    app.use(wdm(compiler, {
        publicPath: webpackConfig.output.publicPath,
    }));

    app.use(whm(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
    }));

    app.use(express.static(path.join(__dirname, '/')));
}());

app.all(/^\/api\/(.*)/, (req, res) => {
    proxy.web(req, res, { target: SERVER_ADDRESS });
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});


const server = http.createServer(app);
server.listen(process.env.PORT || DEFAULT_PORT, () => {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
});
