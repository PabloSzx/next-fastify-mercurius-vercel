import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default App;
