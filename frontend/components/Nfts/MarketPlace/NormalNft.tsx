import Link from "next/link";
import React, { useEffect, useState } from "react";
import { listedNftType, nftPostType } from "../../../Types/blockchain.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/app/store";
import { toast } from "react-toastify";
import { Spinner } from "../../utils/svgs";
import { tokenDecimals } from "../../../utils/constants";
import { ethers } from "ethers";

function NormalNft({
  nft,
  listedNfts,
  handleListedNftsChanged,
}: {
  nft: nftPostType;
  listedNfts: listedNftType[];
  handleListedNftsChanged: () => void;
}) {
  // console.log({ nft, listedNfts });
  const [isListing, setIslisting] = useState(false);
  const [owner, setOwner] = useState<string>();
  const [listingPrice, setListingPrice] = useState<string>();
  const [isAlreadyListed, setIsAlreadyListed] = useState(false);

  const { nftContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );

  useEffect(() => {
    (async () => {
      const filterListedNfts = listedNfts.filter(
        (listedNft) => listedNft.nftId == nft.nftId
      );
      setIsAlreadyListed(filterListedNfts.length > 0);
    })();
  }, [listedNfts]);

  useEffect(() => {
    (async () => {
      const owner = await nftContract?.ownerOf(nft.nftId);
      setOwner(owner.toLowerCase());
    })();
  }, [nft.nftId]);

  async function handleListing() {
    if (!listingPrice) {
      toast("Please enter listing price", { type: "error" });
      return;
    }
    setIslisting(true);
    // console.log(nft.nftId, ethers.parseUnits(listingPrice, tokenDecimals));
    try {
      (
        await nftContract?.listNFT(
          nft.nftId,
          ethers.parseUnits(listingPrice, tokenDecimals)
        )
      ).wait();
      handleListedNftsChanged()
    } catch (error: any) {
      console.error(error);
      toast.error(error.shortMessage, { type: "error" });
    } finally {
      setIslisting(false);
    }
  }

  return (
    // <Link passHref href={`/nft`}>
    <div
      className=" flex cursor-pointer flex-col  items-center rounded-lg  border-slate-400 py-4 gap-3 "
      // onClick={() => nftOnclick(nft)}
    >
      <img className=" h-40 w-40 rounded " src={nft.avatar} />
      <p className=" text-center">
        <a href="">{`#${nft.nftId}`}</a>
        {` - `} {nft.nftName}
      </p>

      {owner && (
        <p className="">
          Owned by{" "}
          {owner == walletAddress
            ? "you"
            : owner.slice(0, 5) +
              "....." +
              owner.slice(owner.length - 5, owner.length)}
        </p>
      )}

      {owner == walletAddress && !isAlreadyListed && (
        <div className=" flex flex-col gap-3 text-center justify-center items-center ">
          <div>
            Enter Price -{" "}
            <input
              className=" border-1 border-purple-500 outline-none bg-slate-300 w-20 rounded px-3 p-1 "
              placeholder="TWT"
              type="text"
              //   value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
            />
          </div>
          <div
            onClick={handleListing}
            className=" cursor-pointer rounded-lg bg-blue-300 px-4 w-min whitespace-nowrap"
          >
            {isListing ? <Spinner /> : "  List Nft"}
          </div>
        </div>
      )}
      {owner == walletAddress && isAlreadyListed && (
        <p className="text-center">Already Listed</p>
      )}
    </div>
    // </Link>
  );
}

export default NormalNft;
