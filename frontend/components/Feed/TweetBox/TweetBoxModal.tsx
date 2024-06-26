import React from "react";
import TweetBox from "./TweetBox";
import { BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { tweetBoxModal } from "../../../Redux/features/GlobalSlice";
import { RootState } from "../../../Redux/app/store";
import MintNft from "../../Nfts/MintNft";
import { useRouter } from "next/router";

function TweetBoxModal({ profileExists }: { profileExists: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isNftProfilePage = router.asPath.includes("nftprofile");
  const { tweetBoxModalState } = useSelector(
    (state: RootState) => state.global
  );

  return (
    <div
      className={` absolute inset-0 flex justify-center bg-black/30 dark:bg-white/20  ${
        (tweetBoxModalState || !profileExists) && !isNftProfilePage
          ? "inline"
          : "hidden"
      } `}
    >
      <div className="mt-8 flex h-[20rem] min-w-[35rem] flex-col rounded-lg bg-white p-4 dark:bg-black border-[0.21rem]">
        {profileExists && (
          <BiX
            onClick={() => dispatch(tweetBoxModal())}
            title="Close"
            className="h-[2rem] w-[2rem] rounded-full bg-gray-300   "
          />
        )}

        {profileExists ? <TweetBox /> : <MintNft />}
      </div>
    </div>
  );
}

export default TweetBoxModal;
