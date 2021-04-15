import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import * as faker from "faker";

const articles = Array.from({ length: 10 }, (v, k) => ({
  id: faker.datatype.uuid(),
  content: faker.lorem.text(),
  authorId: faker.datatype.number(3).toString(),
}));

const typeDefs = gql`
  type Article @key(fields: "id") {
    id: ID!
    content: String!
    author: User!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    articles: [Article]
  }

  extend type Query {
    articles: [Article]
    articleById(id: ID!): Article
  }
`;

type GetArticleByIdArgs = {
  id: String;
};

const resolvers = {
  Query: {
    articles: () => articles,
    articleById: (parent: unknown, args: GetArticleByIdArgs) =>
      articles.find(({ id }) => args.id === id),
  },
  Article: {
    author: (article) => {
      return { __typename: "User", id: article.authorId };
    },
  },
  User: {
    articles: (userRef, params) => {
      return articles.filter((article) => article.authorId === userRef.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema({
    typeDefs,
    resolvers: resolvers as any,
  }),
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
