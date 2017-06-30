import express from 'express';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import schema from './data/schema';
import config from './config';

const PORT = config.graphqlServerPort;
const app = express();

app.use(cors());
app.options('*', cors()); // include before other routes 

app.use('/graphql', graphQLHTTP({ schema}));

// app.get('/graphql', graphQLHTTP({ schema, graphiql: false }));
// app.post('/graphql', graphQLHTTP({ schema, graphiql: false }));
 
// app.use('/graphql', (req, res) => {
//   console.log('received request for graphql');
//   res.json({
//     errors:[
//       {message: 'global error message'}
//     ]
//   });
// });

//app.use('/graphql', (req, res) => {
//  console.log('received request for graphql');
//  res.status(401);
//  res.send('authentication failed');
//});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
