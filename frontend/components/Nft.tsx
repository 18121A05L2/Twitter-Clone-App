import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";

function Nft() {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const { currentNftView, nftContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  const { avatar, id, nftName } = currentNftView;

  const handleApprove = async () => {
    await nftContract?.approve(receiverAddress, id);
    setIsApproved(true);
    setReceiverAddress("");
  };
  const handleTransfer = async () => {
    await nftContract?.transferFrom(walletAddress, receiverAddress, id);
  };

  const operatorAccess = async () => {
    await nftContract?.setApprovalForAll(receiverAddress, true);
  };

  return (
    <div className=" flex flex-col items-center  gap-2 rounded-lg ">
      <h1> Nft Full details</h1>
      <img className=" h-40 w-40" src={avatar} />
      <p> {nftName}</p>
      <div className=" flex flex-row gap-3">
        <input
          className=" w-96 border-2 border-emerald-300 outline-none"
          type="text"
          value={receiverAddress}
          placeholder="receive Address"
          onChange={(e) => setReceiverAddress(e.target.value)}
        ></input>
      </div>
      <div onClick={handleApprove} className=" rounded-lg bg-rose-400 p-2 px-4">
        {isApproved && !receiverAddress ? "Done" : "Approve"}
      </div>
      <div
        onClick={handleTransfer}
        className=" rounded-lg bg-orange-400 p-2 px-4"
      >
        Transfer
      </div>
      <div className=" w-full border-2 border-stone-600"></div>
      <h1> Admin Level Approvals </h1>
      <div
        onClick={operatorAccess}
        className=" rounded-lg bg-yellow-400 p-2 px-4"
      >
        Operator Access for all NFTs
      </div>
    </div>
  );
}

export default Nft;
