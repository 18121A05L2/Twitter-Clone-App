import { useDispatch } from "react-redux";
import { sepoliaTestnetId } from "../../constants/frontend";
import { setWalletAddress } from "../../Redux/features/BlockchainSlice";
import { toast } from "react-toastify";

export const ConnectWallet = () => {
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
              chainId: `0x${sepoliaTestnetId.toString(16)}`,
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
