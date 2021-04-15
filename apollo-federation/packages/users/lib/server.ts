import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import * as faker from "faker";

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String!
  }

  extend type Query {
    me: User
    users: [User]
  }
`;

const users = Array.from({ length: 3 }, (v, k) => ({
  id: k,
  username: faker.internet.userName(),
  email: faker.internet.email(),
}));

const resolvers = {
  Query: {
    me: () => {
      return users[0];
    },
    users: () => {
      return users;
    },
  },
  User: {
    __resolveReference(ref) {
      const id = parseInt(ref.id);
      console.log({ ref });
      return users.find((user) => user.id === id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema({
    typeDefs,
    resolvers,
  }),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
