import { IResolvers } from "mercurius";

export const resolvers: IResolvers = {
  Query: {
    hello() {
      return "hello world";
    },
  },
};
