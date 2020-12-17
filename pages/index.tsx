import { GetServerSideProps } from "next";
import { useQuery } from "react-query";

import { helloWorldDocument, helloWorldQuery } from "../src/graphql";
import { client } from "../src/graphqlClient";

interface HomeProps {
  data: {
    hello: string;
  };
}

const fetchData = async () => {
  const data = await client.request<helloWorldQuery>(helloWorldDocument);

  return data;
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return {
    props: { data: await fetchData() },
  };
};

export default function Home({ data: initialData }: HomeProps) {
  const resp = useQuery("index", fetchData, {
    initialData,
    keepPreviousData: true,
  });

  return <div style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(resp.data, null, 2)}</div>;
}
