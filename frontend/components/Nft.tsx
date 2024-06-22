import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";
import { toast } from "react-toastify";
import { Spinner } from "./utils/svgs";
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import { zeroAddress } from "../utils/constants";

function Nft() {
  const [isApproving, setIsApproving] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [approvedAddress, setApprovedAddress] = useState("");
  const { currentNftView, twitterContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  const { avatar, nftId, nftName } = currentNftView;
  const router = useRouter();

  // check is already approved or not
  useEffect(() => {
    const checkIsApproved = async () => {
      const approvedAddress = await twitterContract?.getApproved(nftId);
      console.log({ approvedAddress });
      setApprovedAddress(approvedAddress != zeroAddress ? approvedAddress : "");
    };

    checkIsApproved();
  }, [twitterContract]);

  const handleApprove = async () => {
    if (approvedAddress) return;
    setIsApproving(true);
    try {
      (await twitterContract?.approveNft(receiverAddress, nftId)).wait();
      toast("Nft approved successfully", { type: "success" });
      setReceiverAddress("");
    } catch (error: any) {
      console.error(error);
      toast(error?.shortMessage, { type: "error" });
    } finally {
      setIsApproving(false);
    }
  };
  const handleTransfer = async () => {
    await twitterContract?.transferFrom(walletAddress, receiverAddress, nftId);
  };

  const operatorAccess = async () => {
    await twitterContract?.setApprovalForAll(receiverAddress, true);
  };
  console.log({ approvedAddress });

  return (
    <div className=" flex flex-col items-center  gap-2 rounded-lg ">
      <div className="flex justify-center items-center w-full ">
        <IoArrowBackSharp
          title="back"
          onClick={() => {
            router.back();
          }}
          className="cursor-pointer rounded-full p-1 text-[2.3rem] hover:bg-gray-300 mr-auto"
        />
        <h1 className=" mr-auto"> Nft Full details</h1>
      </div>

      <img className=" h-40 w-40" src={avatar} alt="nft image" />
      <p> {nftName}</p>
      <div className=" flex flex-row gap-3">
        <input
          className=" w-96 border-2 border-emerald-300 outline-none rounded px-2"
          type="text"
          value={receiverAddress}
          placeholder="receive Address"
          onChange={(e) => setReceiverAddress(e.target.value)}
        ></input>
      </div>
      <div className=" flex gap-3 flex-col justify-center items-center ">
        <div
          onClick={handleApprove}
          className={` rounded-lg p-2 px-4 w-min whitespace-nowrap text-center ${approvedAddress ? " bg-green-500 " : " bg-rose-400 cursor-pointer "} `}
        >
          {approvedAddress ? (
            "Already approved"
          ) : isApproving ? (
            <Spinner />
          ) : (
            "Approve"
          )}
        </div>
        {approvedAddress && (
          <p className="  ">Approved Address: {approvedAddress}</p>
        )}
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
