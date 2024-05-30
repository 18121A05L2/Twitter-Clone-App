import React, { useEffect } from "react";
import SignIn from "../components/auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";
import { setWalletAddress } from "../Redux/features/BlockchainSlice";
import { useRouter } from "next/router";

function IndexPage() {
  const walletAddress = useSelector(
    (state: RootState) => state.blockchain.walletAddress
  );
  const router = useRouter();
  const dispatch = useDispatch();
  // setting wallet address
  useEffect(() => {
    if (window) {
      let walletAddressFromSession =
        window.sessionStorage.getItem("walletAddress");
      dispatch(setWalletAddress(walletAddressFromSession));
    }
  }, []);
  useEffect(() => {
    if (window.ethereum && walletAddress) {
      (async () => {
        const { ethereum } = window;
        window.ethereum.on("accountsChanged", () => {
          console.log("accountsChanged");
          window.sessionStorage.removeItem("walletAddress");
          window.location.reload();
        });

        window.ethereum.on("chainChanged", () => {
          console.log("chainChanged");
          window.location.reload();
        });
        window.ethereum.on("disconnect", () => {
          console.log("disconnect");
        });
      })();
    }
  }, [walletAddress]);

  return (
    <div>
      <SignIn />
    </div>
  );
}

export default IndexPage;
