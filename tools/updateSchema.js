import fs from 'fs';
import { printSchema } from 'graphql/utilities';
import path from 'path';

import schema from '../src/data/schema';
import isofetch from 'isomorphic-fetch';

// fs.writeFileSync(
//   path.join(__dirname, '../src/data/schema.graphql'),
//   printSchema(schema),
// );

import {introspectionQuery} from 'graphql/utilities';
import {graphql} from 'graphql';

async function fetch (operation, variables) {
    console.log('calling fetch with operation: ', operation, ' variables: ', variables);
    const response = await isofetch('http://127.0.0.1:8090/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: operation, variables }),
    });

    if (response.status === 401) {
      console.log('unauthorized. going to login page');
      //throw new RedirectException('http://bing.com/');
      throw new Error('Err-11111: authentication failed');
    }
    
    return response.json();
}

fetch(introspectionQuery, {}).then(data=>console.log(data)).catch(error => console.log(error));


// async () => {
//   const result = await graphql(schema, introspectionQuery);
//   if (result.errors) {
//     throw new Error(result.errors);
//   }

//   fs.writeFileSync(
//     path.join(__dirname, '../src/data/schema.json'),
//     JSON.stringify(result, null, 2)
//   );
// }();

