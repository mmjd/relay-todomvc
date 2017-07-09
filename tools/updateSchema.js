import fs from 'fs';
import { buildClientSchema, printSchema } from 'graphql/utilities';
import path from 'path';
import isofetch from 'isomorphic-fetch';

// import schema from '../src/data/schema';
// fs.writeFileSync(
//   path.join(__dirname, '../src/data/schema.graphql'),
//   printSchema(schema),
// );

import {introspectionQuery} from 'graphql/utilities';
import {graphql} from 'graphql';

async function fetch (operation, variables) {
    console.log('calling fetch with operation: ', operation, ' variables: ', variables);
    const response = await isofetch('http://127.0.0.1:8080/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
'Set-Cookie': 'JSESSIONID=ga8LQWEOrGyAmyKJiuPq-FJw3H5WiTh72dbDZVXR',
      },
      body: JSON.stringify({ query: operation, variables }),
    });

    return response.json();
}

fetch(introspectionQuery, {}).then(data=> { 

fs.writeFileSync(
  path.join(__dirname, '../src/data/schema.graphql'),
  printSchema(buildClientSchema(data.data))
);

})
.catch(error => console.log(error));
