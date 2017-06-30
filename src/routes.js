import makeRouteConfig from 'found/lib/makeRouteConfig';
import Route from 'found/lib/Route';
import React from 'react';
import { graphql } from 'react-relay';

import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import GraphiQLView from './components/GraphiQLView';
import App from './components/App';

const TodoListQuery = graphql`
  query routes_TodoList_Query($status: String!) {
    viewer {
      ...TodoList_viewer
    }
  }
`;

export default makeRouteConfig(

  <Route
    path="/"
    Component={App}
    >
  
  <Route
    path="todo"
    Component={TodoApp}
    query={graphql`
      query routes_TodoApp_Query {
        viewer {
          ...TodoApp_viewer
        }
      }
    `}
    // prerender={(...args) => console.log('prerender args: ', args)}
    // render={({ error, Component, props }) => {console.log('error: ', error, ' component: ', Component, ' props: ', props); return error ? (<div>/ error: {error}</div>) :(
    //             Component && props ? (
    //               <Component {...props} />
    //             ) : (
    //               <div><small>Loading</small></div>
    //             )
    //           )}}
  >
    <Route
      Component={TodoList}
      query={TodoListQuery}
      prepareVariables={params => ({ ...params, status: 'status/any' })}
    //   prerender={(...args) => console.log('prerender args: ', args)}
    // render={({ error, Component, props }) => {console.log('error: ', error, ' component: ', Component, ' props: ', props); return error ? (<div>/ error: {error}</div>) :(
    //             Component && props ? (
    //               <Component {...props} />
    //             ) : (
    //               <div><small>Loading</small></div>
    //             )
    //           )}}
    />
    <Route
      path="status/:status"
      Component={TodoList}
      query={TodoListQuery}
    //   prerender={(...args) => console.log('prerender args: ', args)}
    // render={({ error, Component, props }) => {console.log('error: ', error, ' component: ', Component, ' props: ', props); return error ? (<div>/ error: {error}</div>) :(
    //             Component && props ? (
    //               <Component {...props} />
    //             ) : (
    //               <div><small>Loading</small></div>
    //             )
    //           )}}

    />
   
    
  </Route>
  <Route 
    path="graphql"
    Component={GraphiQLView}>
  </Route>

  </Route>

  
);
