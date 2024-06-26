import React from "react";
import { nftPostType } from "../../../Types/blockchain.types";

function ListedNft({ nft }: { nft: nftPostType }) {
  return (
    <div className=" flex cursor-pointer flex-col  items-center rounded-lg  border-slate-400 py-4 gap-3 ">
      <img className=" h-40 w-40 rounded " src={nft.avatar} />
      <p className="">
        <a href="">{`#${nft.nftId}`}</a>
        {` - `} {nft.nftName}
      </p>
    </div>
  );
}

export default ListedNft;
