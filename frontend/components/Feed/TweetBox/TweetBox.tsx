import React, { useState, useRef } from "react";
import Icons from "../Icons";
import { useDispatch } from "react-redux";
import { tweetAdded } from "../../../Redux/features/GlobalSlice";
import { tweetBoxModal } from "../../../Redux/features/GlobalSlice";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import Link from "next/link";
import axiosAPI from "../../../axios";
import { RootState } from "../../../Redux/app/store";
import {
  PINATA_GATEWAY_URL,
  sepoliaTestnetId,
  tokenDecimals,
} from "../../../constants/frontend";
import { ethers } from "ethers";
import { postType } from "../../../Types/Feed.types";
import { useRouter } from "next/router";
import { Spinner } from "../../utils/svgs";
import { contractAddresses } from "../../../constants/exportJsons";

function TweetBox() {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, twitterContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const dispatch = useDispatch();
  const tweetBoxModalState: Boolean = useSelector(
    (state: any) => state.global.tweetBoxModalState
  );

  async function addTweetToIpfs() {
    setIsLoading(true);

    const data: postType = {
      timeStamp: new Date(),
      userInput: input,
      userId: profile.userId,
      userImage: profile.avatar,
    };

    const userOwnedTokens = await twitterContract?.balanceOf();
    const userBalance = ethers.formatUnits(
      userOwnedTokens.toString(),
      tokenDecimals
    );
    const contractOwnedTokens = await twitterContract?.s_balanceOf(
      contractAddresses[sepoliaTestnetId].Twitter
    );

    console.log(" user Token balance : ", userBalance);
    console.log(
      " contract Token Balance : ",
      ethers.formatUnits(contractOwnedTokens.toString(), tokenDecimals)
    );

    if (Number(userBalance) <= 0) {
      router.push("/wallet");
      return;
    }
    if (profile.avatar) {
      await axiosAPI
        .post("/uploadJsonToIpfs", JSON.stringify(data))
        .then(async (res) => {
          const tweetUrl = `${PINATA_GATEWAY_URL}/${res.data.IpfsHash}`;

          const txtResponse = await twitterContract?.tweet(tweetUrl, {
            value: ethers.parseUnits("1", tokenDecimals),
          });
          await txtResponse.wait();
          // console.log(await twitterContract?.retriveTweets(walletAddress));
          setInput("");
          dispatch(tweetAdded());
          tweetBoxModalState && dispatch(tweetBoxModal());
          console.log("tweet added successfully");
        });
    } else {
      console.log({ profile });
      console.error(" profiled does not exits , add avatar and name ");
    }
    setIsLoading(false);
  }

  return (
    <div className={`relative m-2 flex ${isLoading && " opacity-30"} `}>
      {isLoading && (
        <div className=" absolute flex h-full w-full">
          <svg
            className=" m-auto  h-7 w-7 animate-spin rounded-full border-t-4 border-blue-600 "
            viewBox="0 0 24 24"
          ></svg>
        </div>
      )}

      <Link passHref href={"/profile"}>
        <div className="relative h-[2.5rem] w-[2.5rem] ">
          <Image
            layout="fill"
            className=" m-2 rounded-full"
            src={profile.avatar || "https://links.papareact.com/gll"}
          ></Image>
        </div>
      </Link>

      <div className=" flex flex-1 flex-col   ">
        <textarea
          id="tweet_input"
          className="p-3 outline-none dark:bg-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          cols={50}
          rows={tweetBoxModalState ? 7 : 3}
          placeholder={
            `what's happening ` + profile.userId?.split(" ")[0] + " ?"
          }
        ></textarea>
        <div
          className={`mt-auto flex justify-between ${
            tweetBoxModalState && " border-t-2 "
          }`}
        >
          {/* Icons */}
          <Icons />
          <section className="flex items-center">
            {input && (
              <p className={` ${input.length > 256 && " text-red-500 "}   `}>
                {256 - input?.length}
              </p>
            )}

            <button
              id="tweet_btn"
              className="m-2 rounded-full bg-twitter p-1 px-3 font-bold text-white disabled:opacity-60"
              disabled={!input || input.length > 256}
              onClick={addTweetToIpfs}
            >
              Tweet
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;
