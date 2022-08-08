import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter/variable.css";

import theme from "../theme/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import NextHead from "next/head";

import "../styles/nprogress.css";
import Fonts from "../components/Fonts";
import { InitAxiosInterceptor } from "../utils/interceptor";
import { useStore} from "../stores/authSession";
const isProduction = process.env.NODE_ENV === "production";

function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const router = useRouter();

  InitAxiosInterceptor(useStore())
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <QueryClientProvider client={queryClient}>
        <NextHead>
          <meta charSet="UTF-8" />
          <title>Fe de vida | Identicon.network</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </NextHead>
        {/* <Header /> */}
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
