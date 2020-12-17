import AltairFastify from "altair-fastify-plugin";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import mercurius from "mercurius";
import mercuriusCodegen from "mercurius-codegen";
import { NextApiHandler } from "next";

import { loadFilesSync } from "@graphql-tools/load-files";

import { resolvers } from "./resolvers";

const schema = loadFilesSync("src/api/schema/**/*.gql", {}).map(String);

const buildContext = async (req: FastifyRequest, _reply: FastifyReply) => {
  return {
    authorization: req.headers.authorization,
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module "mercurius" {
  interface MercuriusContext extends PromiseType<ReturnType<typeof buildContext>> {}
}

export const app = Fastify();

app.register(mercurius, {
  schema,
  resolvers,
  context: buildContext,
  jit: 1,
  path: "/api/graphql",
});

mercuriusCodegen(app, {
  targetPath: "src/graphql/index.ts",
  operationsGlob: "src/graphql/**/*.gql",
}).catch(console.error);

app.register(AltairFastify, {
  path: "/api/altair",
  baseURL: "/api/altair/",
  endpointURL: "/api/graphql",
});

declare module "next" {
  interface NextApiRequest {
    method:
      | "DELETE"
      | "GET"
      | "HEAD"
      | "PATCH"
      | "POST"
      | "PUT"
      | "OPTIONS"
      | "delete"
      | "get"
      | "head"
      | "patch"
      | "post"
      | "put"
      | "options"
      | undefined;
  }
}

export const apiHandler: NextApiHandler<unknown> = async (nextRequest, nextResponse) => {
  const { statusCode, body, headers } = await app.inject({
    method: nextRequest.method,
    payload: nextRequest.body,
    headers: nextRequest.headers,
    cookies: nextRequest.cookies,
    query: nextRequest.query,
    url: nextRequest.url,
  });

  for (const headerKey in headers) {
    const header = headers[headerKey]!;
    nextResponse.setHeader(headerKey, header);
  }

  nextResponse.status(statusCode);

  nextResponse.end(body);
};
