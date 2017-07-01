//https://github.com/css-modules/css-modules-require-hook#using-with-babel-node--es6-imports
import csshook from 'css-modules-require-hook/preset'; // import hook before routes
import express from 'express';
// import graphQLHTTP from 'express-graphql';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { getFarceResult } from 'found/lib/server';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
// import webpack from 'webpack';
// import webpackMiddleware from 'webpack-dev-middleware';
import cors from 'cors';
// import hook from 'css-modules-require-hook';
import path from 'path';

import { ServerFetcher } from './fetcher';
import { createResolver, historyMiddlewares, render, routeConfig }
  from './router';
import schema from './data/schema';
import config from './config';

const PORT = config.port;

const app = express();
//app.use(compression());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

// app.use(favicon('assets/img/favicon.ico'))
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/assets/css/todomvc-common.css', express.static(path.join(__dirname, '../node_modules/todomvc-common/base.css')));
app.use('/assets/css/todomvc-app-css.css', express.static(path.join(__dirname, '../node_modules/todomvc-app-css/index.css')));


// console.log('css-modules-require-hook: ', hook);
//https://github.com/css-modules/css-modules-require-hook
// hook({
//   generateScopedName: '[name]__[local]___[hash:base64:5]',
//   extensions: ['.scss', '.css', '.less'] // or whatever you're using
// });

//app.use(cors());
//app.options('*', cors()); // include before other routes 
//app.use('/graphql', graphQLHTTP({ schema }));

// const webpackConfig = {
//   entry: [
//     'babel-polyfill',
//     './src/client',
//   ],

//   output: {
//     path: '/',
//     filename: 'bundle.js',
//   },

//   module: {
//     rules: [
//       { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
//       { test: /\.css$/, use: ExtractTextPlugin.extract('css-loader') },
//       { test: /learn\.json$/, use: 'file-loader?name=[name].[ext]' },
//     ],
//   },

//   plugins: [
//     new ExtractTextPlugin('styles.css'),
//   ],
// };

// app.use(webpackMiddleware(webpack(webpackConfig), {
//   stats: { colors: true },
// }));

app.use(async (req, res) => {
  const fetcher = new ServerFetcher(config.graphqlServerUrl);

  const callback = (error) => {
    console.log('server-side callback: ', error);
    res.redirect(302, 'http://google.com?currentLocation='+req.originalUrl);
    return;
  }

  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    historyMiddlewares,
    routeConfig,
    resolver: createResolver(fetcher, callback),
    render,
  });

  if (redirect) {
    res.redirect(302, redirect.url);
    return;
  }

  /* 
  Notes:
    1. vendor.bundle.js must be loaded before bundle.js otherwise you get webpackJsonp error.
  */

  res.status(status).send(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Relay • TodoMVC</title>

  ${config.isProduction ? '<link rel="stylesheet" href="/build/styles.css"></link>' : '<link rel="stylesheet" href="//localhost:8888/build/styles.css"></link>'}

  <link rel="stylesheet" href="/assets/css/todomvc-common.css"></link>
  <link rel="stylesheet" href="/assets/css/todomvc-app-css.css"></link>

</head>

<body dir>
<div id="root">${ReactDOMServer.renderToString(element)}</div>

<script>
  window.__RELAY_PAYLOADS__ = ${serialize(fetcher, { isJSON: true })};
</script>

${config.isProduction ? '<script src="/build/vendor.bundle.js"></script>' : '<script src="//localhost:8888/build/vendor.bundle.js"></script>'}

${config.isProduction ? '<script src="/build/bundle.js"></script>' : '<script src="//localhost:8888/build/bundle.js"></script>'}



</body>

</html>
  `);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
