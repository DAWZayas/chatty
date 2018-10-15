import { ApolloServer, gql } from 'apollo-server';
import { typeDefs } from './data/schema';
import mockResolver from './data/mocks';

const PORT = 8080;

const server = new ApolloServer({ typeDefs, mocks: mockResolver });
server.listen({ port: PORT }).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
