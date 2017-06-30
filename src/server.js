import express from 'express';
import graphQLHTTP from 'express-graphql';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { getFarceResult } from 'found/lib/server';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import cors from 'cors';

import { ServerFetcher } from './fetcher';
import { createResolver, historyMiddlewares, render, routeConfig }
  from './router';
import schema from './data/schema';
import config from './config';

const PORT = config.port;

const app = express();

app.use(cors());
app.options('*', cors()); // include before other routes 
app.use('/graphql', graphQLHTTP({ schema }));

const webpackConfig = {
  entry: [
    'babel-polyfill',
    './src/client',
  ],

  output: {
    path: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ExtractTextPlugin.extract('css-loader') },
      { test: /learn\.json$/, use: 'file-loader?name=[name].[ext]' },
    ],
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
};

app.use(webpackMiddleware(webpack(webpackConfig), {
  stats: { colors: true },
}));

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

  res.status(status).send(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Relay • TodoMVC</title>
  <link rel="stylesheet" href="styles.css">
</head>

<body>
<div id="root">${ReactDOMServer.renderToString(element)}</div>

<script>
  window.__RELAY_PAYLOADS__ = ${serialize(fetcher, { isJSON: true })};
</script>
<script src="/bundle.js"></script>
</body>

</html>
  `);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
