import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store, { persistor } from "../Redux/app/store";
import DataProvider from "../context/DataContext";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// need to learn about this Session type
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  // document.documentElement.classList.add("dark");
  return (
    // <SessionProvider session={session}>
    <Provider store={store}>
      {/* <DataProvider> */}
      {/* <MoralisProvider initializeOnMount={false}> */}
      {/* <NotificationProvider> */}
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
        <ToastContainer />
      </PersistGate>
      {/* </NotificationProvider> */}
      {/* </MoralisProvider> */}
      {/* </DataProvider> */}
    </Provider>
    // </SessionProvider>
  );
}

export default MyApp;
