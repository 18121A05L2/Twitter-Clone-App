import React, { useEffect, useState } from "react";
import { ethers, TransactionResponse } from "ethers";
import TwitterAbi from "../constants/TwitterAbi.json";
import contractAddresses from "../constants/contractAddresses.json";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";

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
  let { contractBalance, contractOwner, connectedAccounts, contractAddress } =
    data;

  useEffect(() => {
    (async function () {})();
  }, [twitterContract]);

  // need to add more features to it
  useEffect(() => {
    (async () => {
      let allFunders = await twitterContract?.getAllFunders();
      // console.log({ allFunders });
      if (allFunders) {
        let temp1 = await Promise.all(
          allFunders.map(async (funder: string) => {
            let fundedAmt = await twitterContract?.s_addressToAmountFunded(
              funder
            );
            return { [funder]: fundedAmt };
          })
        );
        // console.log({ temp1 });
      }
    })();
  }, [update, twitterContract]);

  async function Fund() {
    try {
      const transactionResponse: TransactionResponse =
        await twitterContract?.fund({
          value: ethers.parseEther(fundAmt),
        });
      await transactionResponse.wait(1);
      const newbalance = Number(await provider?.getBalance(contractAddress));
      setData((prev) => ({ ...prev, contractBalance: newbalance }));
    } catch (err: any) {
      console.log({ err });
      alert(err.shortMessage);
      // if (err.shortMessage.inclues("coavlence")) {
      //   console.log(" delete activity data in the metamask advanced settings");
      // }
    }
    setUpdate(update + 1);
  }
  async function Withdraw() {
    const transactionResponse = await twitterContract?.withdraw();
    await transactionResponse.wait(1);
    const newbalance = Number(await provider?.getBalance(contractAddress));
    setData((prev) => ({ ...prev, contractBalance: newbalance }));
  }

  return (
    <div className=" flex flex-col gap-4">
      <p className=" text-end ">connectedAccount : {walletAddress}</p>
      <h1 className=" text-center font-bold text-green-600 "> FundMe </h1>
      <p> contract Balance : {contractBalance}</p>
      <p> contract Owner : {contractOwner}</p>
      <div className="flex gap-3  align-middle">
        <input
          type="text"
          className=" rounded-md border-2 p-1 outline-none "
          placeholder="enter USD  "
          onChange={(e) => setFundAmt(e.target.value)}
          value={fundAmt}
        ></input>
        <div
          onClick={Fund}
          className=" cursor-default rounded-lg bg-blue-500 p-1 px-4 font-bold "
        >
          Fund
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
        {addressToAmtFunded?.map((obj) => (
          <p> {Object.keys(obj)[0]}</p>
        ))}
      </div>
    </div>
  );
}

export default FundMe;
