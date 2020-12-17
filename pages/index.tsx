import { useQuery } from "react-query";
import { request, gql } from "graphql-request";
import { GetServerSideProps } from "next";

interface HomeProps {
  data: {};
}

const fetchData = async () => {
  const data = await request<HomeProps["data"]>(
    "http://localhost:3000/api/graphql",
    gql`
      query {
        hello
      }
    `,
    {}
  );

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
