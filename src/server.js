import express from 'express';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import schema from './data/schema';

const PORT=8090;
const app = express();

app.use(cors());

app.use('/graphql', graphQLHTTP({ schema, graphiql: true }));
 
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
