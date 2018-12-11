import 'babel-polyfill';

import { ApolloServer } from 'apollo-server';
import { resolvers } from './data/resolvers';
import { typeDefs } from './data/schema';
import configurationManager from './configurationManager';

import mockDB from './data/mocks';

const { port } = configurationManager.graphQL;

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port });
  console.log(`🚀 Server ready at ${url}`);
};

const init = async () => {
  await mockDB(configurationManager.mock);
  startServer();
};

init();
