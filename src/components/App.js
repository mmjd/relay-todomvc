import React, {Component} from 'react';
import Link from 'found/lib/Link';

export default class App extends Component {

	render() {
		return (<div>
		<ul className="filters">
          <li>
            <Link to="/todo" activeClassName="selected" exact>All</Link>
          </li>
          <li>
            <Link to="/graphql" activeClassName="selected">graphiql</Link>
          </li>

        </ul>
		{this.props.children}
		</div>);
	}
}
