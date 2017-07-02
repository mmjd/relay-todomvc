import BrowserProtocol from 'farce/lib/BrowserProtocol';
import createInitialFarceRouter from 'found/lib/createInitialFarceRouter';

//for non-isomorphic
import createFarceRouter from 'found/lib/createFarceRouter';
import queryMiddleware from 'farce/lib/queryMiddleware';
import createRender from 'found/lib/createRender';
import {ServerFetcher} from './fetcher';
import { Environment, RecordSource, Store } from 'relay-runtime';
import Network from './RelayNetwork';
import { Resolver } from 'found-relay';




import React from 'react';
import ReactDOM from 'react-dom';

import { ClientFetcher } from './fetcher';
import { createResolver, historyMiddlewares, render, routeConfig }
  from './router';

import 'todomvc-common/base';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

import './assets/learn.json';

import config from './config';

(async () => {
  // eslint-disable-next-line no-underscore-dangle
  const fetcher = new ClientFetcher(config.graphqlServerUrl, window.__RELAY_PAYLOADS__);
  const resolver = createResolver(fetcher);

  const Router = await createInitialFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares,
    routeConfig,
    resolver,
    render,
  });

  ReactDOM.render(
    <Router resolver={resolver} />,
    document.getElementById('root'), 
  );
});


(()=>{
const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: routeConfig,

  //render: createRender({renderError, renderReady, renderPending}),
  render: createRender({}),
});

const callback = (error) => {
  console.log('error in callback: ', error);
  window.location='http://google.com/?currentLocation='+ window.location;
}

const fetcher = new ServerFetcher(config.graphqlServerUrl);
const environment = new Environment({
  network: Network.create(callback,(...args) => fetcher.fetch(...args)),
  store: new Store(new RecordSource()),
});


ReactDOM.render(
  <Router resolver={new Resolver(environment)} />,
  document.getElementById('root'),
);
})();






/////non-universal
///import BrowserProtocol from 'farce/lib/BrowserProtocol';
// import queryMiddleware from 'farce/lib/queryMiddleware';
// import createFarceRouter from 'found/lib/createFarceRouter';
// import createRender from 'found/lib/createRender';
// import { Resolver } from 'found-relay';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Network from './RelayNetwork';
// //import {Network} from 'relay-runtime';
// //import { Network } from 'relay-local-schema';
// import { Environment, RecordSource, Store } from 'relay-runtime';
// import {ServerFetcher} from './fetcher';

// import routes from './routes';
// import schema from './data/schema';

// import 'todomvc-common/base';
// import 'todomvc-common/base.css';
// import 'todomvc-app-css/index.css';

// //grapiql has css problem. fix by comparing with demo http://graphql.org/swapi-graphql/
// import './assets/graphiql.css';
// import '../node_modules/graphiql/graphiql.css';

// import './assets/learn.json';

// // const environment = new Environment({
// //   network: Network.create({ schema }),
// //   store: new Store(new RecordSource()),
// // });


 
// // const renderError = ({error}) => {console.log('renderError. error: ', error); return (<div>Error: {error}</div>);}
// // const renderPending = (...args) => {console.log('renderPending args: ', args)};
// // const renderReady = (...args) => {console.log('renderReady args: ', args)};

// const Router = createFarceRouter({
//   historyProtocol: new BrowserProtocol(),
//   historyMiddlewares: [queryMiddleware],
//   routeConfig: routes,

//   //render: createRender({renderError, renderReady, renderPending}),
//   render: createRender({}),
// });

// const callback = (error) => {
//   console.log('error in callback: ', error);
//   window.location='http://google.com/?currentLocation='+ window.location;
// }

// const fetcher = new ServerFetcher(`http://localhost:8090/graphql`);
// const environment = new Environment({
//   network: Network.create(callback,(...args) => fetcher.fetch(...args)),
//   store: new Store(new RecordSource()),
// });


// const mountNode = document.createElement('div');
// document.body.appendChild(mountNode);

// ReactDOM.render(
//   <Router resolver={new Resolver(environment)} />,
//   mountNode,
// );

