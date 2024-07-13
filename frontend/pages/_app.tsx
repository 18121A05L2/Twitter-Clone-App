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
import { useEffect } from "react";

// need to learn about this Session type
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  // document.documentElement.classList.add("dark");

  // service workers
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", () => {
  //       navigator.serviceWorker
  //         .register("/service-worker.js")
  //         .then((registration) => {
  //           console.log(
  //             "Service Worker registered with scope:",
  //             registration.scope
  //           );
  //         })
  //         .catch((error) => {
  //           console.error("Service Worker registration failed:", error);
  //         });
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const handleAccountsChanged = () => {
      console.log("accountsChanged");
      window.sessionStorage.clear();
      window.localStorage.clear();
      window.location.reload();
    };

    const handleChainChanged = () => {
      console.log("chainChanged");
      window.sessionStorage.clear();
      window.localStorage.clear();
      window.location.reload();
    };

    const handleDisconnect = () => {
      console.log("disconnect");
    };

    if (window.ethereum) {
      const { ethereum } = window;

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("disconnect", handleDisconnect);

      // Cleanup listeners on component unmount
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
        ethereum.removeListener("disconnect", handleDisconnect);
      };
    }
  }, []);

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
