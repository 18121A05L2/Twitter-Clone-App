import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";
import { ethers } from "ethers";
import { tokenDecimals } from "../constants/frontend";
import { Spinner } from "./utils/svgs";

function Wallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    senderAddress: "",
    amount: "",
  });
  const { senderAddress, amount } = inputs;
  const [token, setToken] = useState({
    name: "",
    symbolName: "",
    totalSupply: 0,
  });
  const [data, setData] = useState({
    walletAddress: "",
    ethBalance: 0,
    tokenBalance: 0,
  });
  const { provider, signer, twitterContract } = useSelector(
    (state: RootState) => state.blockchain
  );

  useEffect(() => {
    const execute = async () => {
      let name = await twitterContract?.s_name();
      let symbolName = await twitterContract?.s_symbol();
      let totalSupply = Number(await twitterContract?.TOTAL_SUPPLY());
      const balance = await twitterContract?.balanceOf();
      const tokenBalance = Number(
        ethers.formatUnits(Number(balance).toString(), tokenDecimals)
      );

      setToken((prev) => ({ ...prev, name, symbolName, totalSupply }));
      if (signer) {
        let account: string = await signer.getAddress();
        account && setData((prev) => ({ ...prev, walletAddress: account }));
        let ethBalance = Number(await provider?.getBalance(account!)) / 1e18;
        setData({ ...data, tokenBalance, ethBalance });
      }
    };
    execute();
  }, [twitterContract]);

  async function sendTokens() {
    let transactionResponse = await twitterContract?.transfer({
      to: senderAddress,
      value: ethers.parseEther(amount),
    });
  }
  console.log(inputs);

  async function onFaucetClick() {
    setIsLoading(true);
    const transactionResponse = await twitterContract?.faucet();
    const balance = await twitterContract?.balanceOf();
    const tokenBalance = Number(
      ethers.formatUnits(Number(balance).toString(), tokenDecimals)
    );
    setData((prev) => ({ ...prev, tokenBalance }));
    await transactionResponse.wait(1);
    setIsLoading(false);
  }

  return (
    <div className=" flex flex-col gap-5 ">
      <h1 className=" text-center ">Wallet</h1>
      <div> account balance : {}</div>
      <div className=" flex gap-2 align-middle ">
        <label>send money to : </label>{" "}
        <input
          className=" w-1/2 rounded-md border-2 p-1 outline-none "
          placeholder="enter address to send"
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              senderAddress: e.target.value,
            }))
          }
        ></input>
        <input
          className=" w-1/2 rounded-md border-2 p-1 outline-none "
          placeholder="enter number of tokens"
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              amount: e.target.value,
            }))
          }
        ></input>
        <div
          className=" w-20 bg-blue-300 p-1 text-center "
          onClick={sendTokens}
        >
          {" "}
          Enter{" "}
        </div>
      </div>
      <button
        onClick={onFaucetClick}
        className=" min-w-5xl ml-auto mr-auto mt-10 flex gap-4 rounded-xl bg-blue-400 p-3 text-center text-2xl font-bold "
      >
        {isLoading && <Spinner />}

        {isLoading ? "Loading" : "Faucet"}
      </button>

      {!data.tokenBalance && (
        <p className="text-red-500">
          {" "}
          You don't have any tokens , get it from faucet
        </p>
      )}

      <p> current User Balance : {data.tokenBalance}</p>
      <p> current Eth Balance : {data.ethBalance}</p>
    </div>
  );
}

export default Wallet;
