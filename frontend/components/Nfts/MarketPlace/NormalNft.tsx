import Link from "next/link";
import React, { useState } from "react";
import { nftPostType } from "../../../Types/blockchain.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/app/store";
import { toast } from "react-toastify";
import { Spinner } from "../../utils/svgs";

function NormalNft({ nft }: { nft: nftPostType }) {
  const [isListing, setIslisting] = useState(false);
  const [listingPrice, setListingPrice] = useState<number>();
  console.log({ listingPrice });
  const { twitterContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );

  async function handleListing() {
    if (!listingPrice) {
      toast("Please enter listing price", { type: "error" });
      return;
    }
    setIslisting(true);
    console.log(nft.nftId, listingPrice);
    try {
      (await twitterContract?.listNFT(nft.nftId, listingPrice)).wait();
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
      <img className=" h-40 w-40" src={nft.avatar} />
      <p className="">
        <a href="">{`#${nft.nftId}`}</a>
        {` - `} {nft.nftName}
      </p>

      {nft.address && (
        <p className="">
          Owned by{" "}
          {nft.address.slice(0, 5) +
            "......" +
            nft.address.slice(nft.address.length - 5, nft.address.length)}
        </p>
      )}

      {nft.address == walletAddress && (
        <div className=" flex flex-col gap-3 text-center justify-center items-center ">
          <div>
            Enter Price -{" "}
            <input
              className=" border-1 border-purple-500 outline-none bg-slate-300 w-20 rounded px-3 p-1 "
              placeholder="TWT"
              type="text"
              //   value={listingPrice}
              onChange={(e) => setListingPrice(Number(e.target.value))}
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
    </div>
    // </Link>
  );
}

export default NormalNft;
