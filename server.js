const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

require('dotenv').config();

const { findOrCreateUser } = require('./controllers/userController');

mongoose
  .connect('mongodb://localhost:27017/geopin', { useNewUrlParser: true })
  .then(() => {
    console.log('Db connected');
  })
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser= await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`);
    }

    return { currentUser }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listen on ${url}`);
});
