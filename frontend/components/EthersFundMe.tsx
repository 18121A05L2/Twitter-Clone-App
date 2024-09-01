import React, { useEffect, useState } from "react";
import { ethers, TransactionResponse } from "ethers";
import { TwitterAbi } from "../utils/exportJsons";
import { contractAddresses } from "../utils/exportJsons";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";
import { toast } from "react-toastify";
import { Spinner } from "./utils/svgs";
import { currentEthPrice } from "../utils/constants";

type DataType = {
  contractBalance: number;
  contractOwner: string;
  connectedAccounts: Array<string>;
  contractAddress: string;
};

type MeatamaskType = {
  contract: ethers.Contract;
  signer: ethers.Signer;
  provider: ethers.Provider;
};

function FundMe() {
  const { twitterContract, walletAddress, provider, signer } = useSelector(
    (state: RootState) => state.blockchain
  );
  const [fundAmt, setFundAmt] = useState("");
  const [addressToAmtFunded, setAddressToAmtFunded] = useState([]);
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState<DataType>({
    contractBalance: 0,
    contractOwner: "",
    connectedAccounts: [],
    contractAddress: "",
  });
  const [isFundLoading, setIsFundLoading] = useState(false);
  let { contractBalance, contractOwner, connectedAccounts, contractAddress } =
    data;

  useEffect(() => {
    (async function () {
      const networkConfig = await provider?.getNetwork();
      const chainId = Number(networkConfig?.chainId) ?? 31337;
      const contractAddress = contractAddresses[chainId].Twitter;
      const balance = Number(await provider?.getBalance(contractAddress));
      const owner = await twitterContract?.getOwner();
      setData((prev) => ({
        ...prev,
        contractBalance: Number(ethers.formatEther(balance.toString())),
        contractAddress,
        contractOwner: owner,
      }));
    })();

    // get eth price
  }, [twitterContract]);

  // need to add more features to it
  useEffect(() => {
    (async () => {
      let allFunders = await twitterContract?.getAllFunders();
      if (allFunders) {
        let temp1 = await Promise.all(
          allFunders.map(async (funder: string) => {
            let fundedAmt =
              await twitterContract?.s_addressToAmountFunded(funder);
            return { [funder]: fundedAmt };
          })
        );
      }
    })();
  }, [update, twitterContract]);

  async function Fund() {
    setIsFundLoading(true);
    try {
      console.log(typeof fundAmt);
      let finalAmount = Number(fundAmt) / currentEthPrice;
      const transactionResponse: TransactionResponse =
        await twitterContract?.fund({
          value: ethers.parseEther(finalAmount.toString()),
        });
      await transactionResponse.wait(1);
      const newbalance = Number(await provider?.getBalance(contractAddress));
      setData((prev) => ({
        ...prev,
        contractBalance: Number(ethers.formatEther(newbalance.toString())),
      }));
    } catch (err: any) {
      console.log({ err });
      toast(err.shortMessage, { type: "error" });
    }
    setUpdate(update + 1);
    setIsFundLoading(false);
  }
  async function Withdraw() {
    const transactionResponse = await twitterContract?.withdraw();
    await transactionResponse.wait(1);
    const newbalance = Number(await provider?.getBalance(contractAddress));
    setData((prev) => ({
      ...prev,
      contractBalance: Number(ethers.formatEther(newbalance.toString())),
    }));
  }

  return (
    <div className=" flex flex-col gap-4">
      <p className=" text-end ">connectedAccount : {walletAddress}</p>
      <h1 className=" text-center font-bold text-green-600 "> FundMe </h1>
      <p> contract Eth Balance : {contractBalance}</p>
      <p> contract Owner : {contractOwner}</p>
      <p> contract Address : {contractAddress}</p>
      <div className="flex gap-3  align-middle">
        <input
          type="text"
          className=" rounded-md border-2 p-1 outline-none text-black "
          placeholder="enter USD  "
          onChange={(e) => setFundAmt(e.target.value)}
          value={fundAmt}
        ></input>
        <div
          onClick={Fund}
          className={` cursor-default rounded-lg bg-blue-500 p-1 px-4 font-bold ${isFundLoading ? "" : " cursor-pointer"} `}
        >
          {isFundLoading ? <Spinner /> : "Fund"}
        </div>
        <div
          onClick={Withdraw}
          className=" cursor-default rounded-lg bg-green-500 p-1 px-4 font-bold "
        >
          Withdraw
        </div>
      </div>
      <div>
        <h1>Funders History</h1> <p></p>
        {addressToAmtFunded?.map((obj) => <p> {Object.keys(obj)[0]}</p>)}
      </div>
    </div>
  );
}

export default FundMe;
