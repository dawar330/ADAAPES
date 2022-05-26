import "../styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { colors } from "../styles/colors";
import Nav from "../components/Nav";
import { ThemeProvider } from "styled-components";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={colors}>
      <NextNProgress
        color={colors.primary}
        startPosition={0.3}
        stopDelayMs={300}
        height={3}
        showOnShallow={true}
        options={{ easing: "ease", speed: 300, showSpinner: false }}
      />
      <Nav />
      <Component {...pageProps} />

      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </ThemeProvider>
  );
}
