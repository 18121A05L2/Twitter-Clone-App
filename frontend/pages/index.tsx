import React, { useEffect } from "react";
import SignIn from "../components/auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";
import { setWalletAddress } from "../Redux/features/BlockchainSlice";
import { useRouter } from "next/router";
import useContracts from "../components/hooks/useContracts";

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

  return (
    <div>
      <SignIn />
    </div>
  );
}

export default IndexPage;
