import React from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';

export default class GraphiQLView extends React.Component {
	// render() {
	// 	return (<div>
	// 		grapiqlview
	// 		</div>);
	// }

	render() {
		return (
			<GraphiQL fetcher={this.graphQLFetcher} />
			);
	}

	graphQLFetcher = (graphQLParams) => {
	  return fetch('http://127.0.0.1:8090/graphql', {
	    method: 'post',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(graphQLParams),
	  }).then(response => response.json());
	}

}