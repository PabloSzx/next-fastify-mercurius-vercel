import { GraphQLClient } from "graphql-request";

import { SERVER_URL } from "./constants";

export const client = new GraphQLClient(`${SERVER_URL}/api/graphql`);
