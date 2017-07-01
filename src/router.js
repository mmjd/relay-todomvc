import queryMiddleware from 'farce/lib/queryMiddleware';
import createRender from 'found/lib/createRender';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import Route from 'found/lib/Route';
import { Resolver } from 'found-relay';
import React from 'react';
import { graphql } from 'react-relay';
import { Environment, /*Network, */RecordSource, Store } from 'relay-runtime';
import Network from './RelayNetwork';

// import TodoApp from './components/TodoApp';
// import TodoList from './components/TodoList';

export const historyMiddlewares = [queryMiddleware];

export function createResolver(fetcher, callback) {
  const environment = new Environment({
    network: Network.create(callback, (...args) => fetcher.fetch(...args)),
    store: new Store(new RecordSource()),
  });

  return new Resolver(environment);
}

const TodoListQuery = graphql`
  query router_TodoList_Query($status: String!) {
    viewer {
      ...TodoList_viewer
    }
  }
`;

export const routeConfig = makeRouteConfig(
  <Route
    path="/"
    getComponent={() => (
      System.import('./components/TodoApp.js').then(module => module.default)
    )}
    // Component={TodoApp}
    query={graphql`
      query router_TodoApp_Query {
        viewer {
          ...TodoApp_viewer
        }
      }
    `}
  >
    <Route
      // Component={TodoList}
      getComponent={() => (
        System.import('./components/TodoList.js').then(module => module.default)
      )}
      query={TodoListQuery}
      prepareVariables={params => ({ ...params, status: 'any' })}
    />
    <Route
      path=":status"
      // Component={TodoList}
      getComponent={() => (
        System.import('./components/TodoList.js').then(module => module.default)
      )}
      query={TodoListQuery}
    />
  </Route>,
);

export const render = createRender({});
