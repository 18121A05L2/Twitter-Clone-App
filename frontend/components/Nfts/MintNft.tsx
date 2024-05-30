import React from "react";
import { BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { tweetBoxModal } from "../../Redux/features/GlobalSlice";
import { RootState } from "../../Redux/app/store";
import TweetBox from "../Feed/TweetBox/TweetBox";
import { useRouter } from "next/router";

function MintNft() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="flex h-[inherit] cursor-pointer items-center justify-center p-2">
      <div
        onClick={() => {
          dispatch(tweetBoxModal());
          router.push("/nftprofile");
        }}
        className=" rounded-2xl bg-blue-300 p-3"
      >
        {" "}
        Mint an NFT Profile
      </div>
    </div>
  );
}

export default MintNft;
