import Image from "next/image";
import { ConnectButton } from "web3uikit";
import { useDispatch, useSelector } from "react-redux";
import { setWalletAddress } from "../../Redux/features/BlockchainSlice";
import { sepoliaTestnetId, localTestnetId } from "../../constants/frontend";
import { NewTwitterLogo, Spinner } from "../utils/svgs";
import { RootState } from "../../Redux/app/store";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useState } from "react";
import useContracts from "../hooks/useContracts";
import DarkMode from "../utils/darkMode";
import { ConnectWallet } from "../utils/reusable";
import axiosAPI from "../../axios";

export default function SignIn() {
  useContracts();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { twitterContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  const { isDarkMode } = useSelector((state: RootState) => state.global);
  function connectWallet() {
    if (window.ethereum) {
      (async () => {
        const fetchWalletAddress = await ConnectWallet();
        dispatch(setWalletAddress(fetchWalletAddress));
      })();
    }
  }

  async function handleFreeEth() {
    setIsLoading(true);
    const freeEth = 0.01;
    try {
      const isFreeEthSuccess = await twitterContract?.freeEth(
        ethers.parseEther(freeEth.toString())
      );
      if (walletAddress) {
        router.push("/home");
      }
    } catch (err : any) {
      // console.log({ err });
      toast(err.shortMessage, { type: "error" });
    }
    setIsLoading(false);
  }

  async function handleSenbdEth() {
    setIsLoading(true);

    const res = await axiosAPI.post(
      "/sendEth",
      JSON.stringify({ address: walletAddress })
    );
    console.log({ res });

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 dark:bg-black dark:text-white">
      <DarkMode />
      <div className="flex max-w-xl flex-col items-center gap-5 rounded-[3rem] border p-6 ">
        <div
          className=" w-[4rem] cursor-pointer "
          onClick={() => router.push("/home")}
        >
          {/* <Image
            layout="fill"
            src="https://links.papareact.com/gll"
            alt="twitter"
          ></Image> */}
          <NewTwitterLogo isDarkMode={isDarkMode} />
        </div>
        <h1 className="text-[4rem] font-bold">Happening now</h1>
        <h2 className="text-[2rem] font-bold">Join Twitter today</h2>
        <div
          onClick={connectWallet}
          className=" cursor-pointer rounded-2xl bg-[rgb(242,246,255)] p-2 px-4 font-bold text-[rgb(46,125,175)]"
        >
          {walletAddress ? walletAddress : "Connect Wallet"}
        </div>
      </div>
      <div
        className=" min-w-16 cursor-pointer rounded-full bg-orange-200 p-3 px-5 "
        onClick={handleFreeEth}
      >
        {isLoading ? <Spinner /> : " Get 0.01 testnet eth to play with"}
      </div>

      <div
        className=" min-w-16 cursor-pointer rounded-full bg-orange-200 p-3 px-5 "
        onClick={handleSenbdEth}
      >
        {isLoading ? <Spinner /> : " send eth without interacting"}
      </div>
    </div>
  );
}
