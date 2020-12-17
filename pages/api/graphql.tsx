import { NextApiHandler } from "next";

import Fastify from "fastify";
import mercurius from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";

const app = Fastify();

app.register(mercurius, {
  schema: gql`
    type Query {
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello() {
        return "hello world";
      },
    },
  },
});

mercuriusCodegen(app, {
  targetPath: "./src/graphql.generated.ts",
});

const handler: NextApiHandler = async (req, res) => {
  await app.ready();
  const response = await app.inject({
    method: req.method as any,
    payload: req.body,
    headers: req.headers,
    cookies: req.cookies,
    query: req.query,
    url: "/graphql",
  });

  res.status(response.statusCode);

  res.json(response.body);
};

export default handler;
