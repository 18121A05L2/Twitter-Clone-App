import Image from "next/image";
import { ConnectButton } from "web3uikit";
import { useDispatch, useSelector } from "react-redux";
import { setWalletAddress } from "../../Redux/features/BlockchainSlice";
import { sepoliaExplorer, explorerPaths } from "../../utils/constants";
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
  const [isEthWithGas, setIsEthWithGas] = useState(false);
  const [isFreeEth, setIsFreeEth] = useState(false);
  const [transaction, setTransaction] = useState("");
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

  async function getEthWithGas() {
    setTransaction("");
    if (!walletAddress) {
      toast("Please connect your wallet", { type: "error" });
      return;
    }
    setIsEthWithGas(true);
    const freeEth = 0.01;
    try {
      const ContractTransactionResponse = await twitterContract?.freeEth(
        ethers.parseEther(freeEth.toString())
      );
      setTransaction(
        `${sepoliaExplorer}/${explorerPaths.transaction}/${ContractTransactionResponse.hash}`
      );
    } catch (err: any) {
      // console.log({ err });
      toast(err.shortMessage, { type: "error" });
    } finally {
      setIsEthWithGas(false);
    }
  }

  async function getFreeEth() {
    setTransaction("");
    if (!walletAddress) {
      toast("Please connect your wallet", { type: "error" });
      return;
    }
    setIsFreeEth(true);
    try {
      const res = (await axiosAPI.post(
        "/sendEth",
        JSON.stringify({ address: walletAddress })
      )) as { data: { txHash: string } };
      setTransaction(
        `${sepoliaExplorer}/${explorerPaths.transaction}/${res.data.txHash}`
      );
      console.log({ res });
    } catch (err: any) {
      toast(err.shortMessage, { type: "error" });
    } finally {
      setIsFreeEth(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 dark:bg-black dark:text-white">
      <DarkMode />
      <div className="flex max-w-xl flex-col items-center gap-5 rounded-[3rem] border p-6 ">
        <a className=" w-[4rem] cursor-pointer " href="/home">
          {/* <Image
            layout="fill"
            src="https://links.papareact.com/gll"
            alt="twitter"
          ></Image> */}
          <NewTwitterLogo isDarkMode={isDarkMode} />
        </a>
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
        className=" min-w-16 cursor-pointer rounded-full bg-orange-200 p-3 px-5 dark:bg-green-400 "
        onClick={getEthWithGas}
      >
        {isEthWithGas ? (
          <Spinner />
        ) : (
          "Get 0.01 testnet eth by bearing gas cost "
        )}
      </div>

      <div
        className=" min-w-16 cursor-pointer rounded-full bg-orange-200 p-3 px-5 dark:bg-green-400  "
        onClick={getFreeEth}
      >
        {isFreeEth ? <Spinner /> : "Get free eth without any gas cont "}
      </div>
      {transaction ? (
        <p>
          <a className=" underline" href={transaction} target="_blank">
            click here
          </a>
          to check the transaction or{" "}
          <a className=" underline " href="/home">
            Go to Home page
          </a>
        </p>
      ) : (
        <a className=" underline " href="/home">
          Go to Home page
        </a>
      )}
    </div>
  );
}
