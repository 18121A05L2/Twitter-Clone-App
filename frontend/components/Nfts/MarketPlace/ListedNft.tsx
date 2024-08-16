import React, { useEffect, useState } from "react";
import { listedNftType, nftPostType } from "../../../Types/blockchain.types";
import { RootState } from "../../../Redux/app/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { tokenDecimals } from "../../../utils/constants";
import { useRouter } from "next/router";

function ListedNft({
  listedNft,
  handleListedNftsChanged,
}: {
  listedNft: listedNftType;
  handleListedNftsChanged: () => void;
}) {
  // console.log({ listedNft });
  const [nftInfo, setNftInfo] = useState<nftPostType>();
  const [ownerOfNft, setOwnerOfNft] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { price, sender, nftId } = listedNft;
  const listedPrice = ethers.formatUnits(listedNft.price, tokenDecimals);
  const router = useRouter();
  const { nftContract, walletAddress, twitterContract } = useSelector(
    (state: RootState) => state.blockchain
  );

  useEffect(() => {
    (async () => {
      const nftTokenUri = await nftContract?.tokenURI(nftId);
      const nftInfo = await fetch(nftTokenUri).then((res) => res.json());
      setNftInfo(nftInfo);
      const ownerOfNft = await nftContract?.ownerOf(nftId);
      setOwnerOfNft(ownerOfNft);
      // console.log({ nftInfo });
    })();
  }, [listedNft]);

  async function handleBuy() {
    setIsLoading(true);
    if (sender.toLowerCase() == walletAddress.toLowerCase()) {
      toast("you can't buy your own nft", { type: "error" });
      return;
    }

    const userOwnedTokens = await twitterContract?.balanceOf();
    const userBalance = ethers.formatUnits(
      userOwnedTokens.toString(),
      tokenDecimals
    );
    if (Number(userBalance) <= 0) {
      toast("you don't have enough TWT", { type: "error" });
      router.push("/wallet");
      return;
    }
    try {
      await (await nftContract?.buyNFT(nftId, price)).wait();
      toast("Nft bought successfully for " + listedPrice + " TWT", {
        type: "success",
      });
      handleListedNftsChanged();
    } catch (error: any) {
      console.log({ error });
      toast(error.shortMessage, { type: "error" });
    }
    setIsLoading(false);
  }

  async function handleCancel() {
    setIsLoading(true);
    try {
      await (await nftContract?.cancelNFT(nftId)).wait();
      toast("Nft canceled successfully", { type: "success" });
      handleListedNftsChanged();
    } catch (err: any) {
      toast(err.shortMessage, { type: "error" });
    }
    setIsLoading(false);
  }

  return (
    <div
      className={` flex cursor-pointer flex-col  items-center rounded-lg  border-slate-400 py-4 gap-3 ${isLoading ? " animate-pulse " : ""} `}
    >
      <img className=" h-40 w-40 rounded " src={nftInfo?.avatar} />
      <p className=" text-center">
        <a href="">{`#${nftInfo?.nftId}`}</a>
        {` - `} {nftInfo?.nftName}
      </p>
      <p
        className=" bg-blue-500 p-2 text-yellow-300 rounded"
        onClick={handleBuy}
      >
        Buy for {listedPrice} TWT
      </p>
      {sender.toLowerCase() == walletAddress.toLowerCase() && (
        <p
          className="bg-red-500 p-2 text-yellow-300 rounded"
          onClick={handleCancel}
        >
          cancel listing
        </p>
      )}
    </div>
  );
}

export default ListedNft;
