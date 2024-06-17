import { localTestnetId, sepoliaTestnetId } from "../../utils/constants";
import { toast } from "react-toastify";

export const ConnectWallet = () => {
  const useLocalBlocakchain = process.env.NEXT_PUBLIC_USE_LOCAL_BLOCKCHAIN;
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
      (async () => {
        const { ethereum } = window;
        const connectedAccounts = (await ethereum.request({
          method: "eth_requestAccounts",
        })) as Array<string>;

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${(useLocalBlocakchain ? localTestnetId : sepoliaTestnetId).toString(16)}`,
            },
          ],
        });
        console.log(connectedAccounts);
        const walletAddress = connectedAccounts[0]; // it can rerturn the multiple conntected accounts
        window.sessionStorage.setItem("walletAddress", walletAddress);
        toast("Wallet connected successfully");
        resolve(walletAddress);
      })();
    }
  });
};
