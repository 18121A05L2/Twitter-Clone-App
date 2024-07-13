import Image from "next/image";
import { ConnectButton } from "web3uikit";
import { useDispatch, useSelector } from "react-redux";
import { setWalletAddress } from "../../Redux/features/BlockchainSlice";
import {
  mainnetEtherscanApi,
  sepoliaEtherscanApi,
  sepoliaExplorer,
} from "../../utils/constants";
import { NewTwitterLogo, Spinner } from "../utils/svgs";
import { RootState } from "../../Redux/app/store";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useContracts from "../hooks/useContracts";
import DarkMode from "../utils/darkMode";
import { ConnectWallet } from "../utils/reusable";
import axiosAPI from "../../axios";
import { explorerPaths } from "../../utils/constants.json";
import Moment from "react-moment";
import { transactionData } from "../../Types/blockchain.types";
import { sortArray } from "../../utils/commonFunctions";
import MetamaskLogo from "../utils/Metamask";

export default function SignIn() {
  useContracts();
  const [isEthWithGas, setIsEthWithGas] = useState(false);
  const [isFreeEth, setIsFreeEth] = useState(false);
  const [transaction, setTransaction] = useState("");
  const [isFreeEthAlreadySent, setIsFreeEthAlreadySent] =
    useState<transactionData[]>();
  const dispatch = useDispatch();
  const router = useRouter();
  const { twitterContract, walletAddress, provider } = useSelector(
    (state: RootState) => state.blockchain
  );
  const [displayMetamask, setShouldDisplayMetamask] = useState(false);
  const currentTimestamp = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  useEffect(() => {
    (async () => {
      if (
        Boolean(provider?.getNetwork) &&
        process.env.NEXT_PUBLIC_USE_LOCAL_BLOCKCHAIN === "false"
      ) {
        const { chainId, name } = await provider?.getNetwork();
        const etherscanAPi =
          name === "sepolia" ? sepoliaEtherscanApi : mainnetEtherscanApi;
        console.log({ chainId, name, etherscanAPi });
        const timeStamp = (currentTimestamp - twentyFourHours) / 1000;
        const { data } = await axiosAPI.get(etherscanAPi, {
          params: {
            module: "account",
            action: "txlist",
            tag: "latest",
            address: walletAddress,
            startblock: 0,
            endblock: 99999999,
            sort: "asc",
            // TODO : CHECK WHETHER THIS NEEDS TO BE MOVED TO BACKEND
            apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
          },
        });

        const filteredData = data.result.filter(
          (item: { timeStamp: number }) => Number(item.timeStamp) > timeStamp
        );
        const sortedData = sortArray(filteredData, "timeStamp", false);
        setIsFreeEthAlreadySent(filteredData);
        console.log({ filteredData, timeStamp });
      }
    })();
  }, [walletAddress, provider, process.env, isFreeEth]);

  const { isDarkMode } = useSelector((state: RootState) => state.global);
  function connectWallet() {
    if (window.ethereum) {
      (async () => {
        setShouldDisplayMetamask(false);
        const fetchWalletAddress = await ConnectWallet();
        dispatch(setWalletAddress(fetchWalletAddress));
      })();
    } else {
      setShouldDisplayMetamask(true);
      toast("install metamask to connect", { type: "warning" });
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
    if (Boolean(isFreeEthAlreadySent?.length)) {
      return;
    }
    if (!walletAddress) {
      toast("Please connect your wallet", { type: "error" });
      return;
    }
    setIsFreeEth(true);
    try {
      const res = (await axiosAPI.post(
        "/sendEth",
        JSON.stringify({ address: walletAddress })
      )) as { data: { txHash: string; amount: string } };
      setTransaction(
        `${sepoliaExplorer}/${explorerPaths.transaction}/${res.data.txHash}`
      );
      toast(` You have received ${res.data.amount} ETH successfully `, {
        type: "success",
      });
    } catch (err: any) {
      console.error({ err });
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

      {displayMetamask && (
        <a
          href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          id="metamask-container"
          target="_blank"
        >
          <MetamaskLogo
            pxNotRatio={true}
            width={150}
            height={120}
            followMouse={true}
            slowDrift={false}
          />
          {/* <img
          alt="Metamask"
          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
          className=" w-32 h-32 cursor-pointer"
        /> */}
        </a>
      )}

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
        className={` min-w-16 cursor-pointer rounded-full bg-orange-200 p-3 px-5 dark:bg-green-400  ${Boolean(isFreeEthAlreadySent?.length) && " bg-slate-200 cursor-none "} `}
        onClick={getFreeEth}
      >
        {isFreeEth ? (
          <Spinner />
        ) : Boolean(isFreeEthAlreadySent?.length) && isFreeEthAlreadySent ? (
          <>
            Already sent free eth{" "}
            <Moment fromNow>
              {Number(isFreeEthAlreadySent[0]?.timeStamp) * 1000}
            </Moment>
            {", "}
            Redeem again{" "}
            <Moment toNow subtract={{ hours: 24 }}>
              {Number(isFreeEthAlreadySent[0]?.timeStamp) * 1000}
            </Moment>
          </>
        ) : (
          "Get free eth without any gas cost "
        )}
      </div>
      {transaction ? (
        <p>
          <a className=" underline" href={transaction} target="_blank">
            click here {"  "}
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
