import React from "react";

function NftCard({ nft }) {
  return (
    <div className=" flex flex-col items-center  rounded-lg  ">
      <img className=" h-40 w-40" src={nft.avatar} />
      <p> {nft.nftName}</p>
      <div className=" cursor-pointer rounded-lg bg-slate-500 px-2">
        {" "}
        Set as NFT profile
      </div>
    </div>
  );
}

export default NftCard;
