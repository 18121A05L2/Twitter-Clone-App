import { HiOutlineRefresh } from "react-icons/hi";
import DisplayTweets from "./DisplayTweets/DisplayTweets";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TweetBox from "./TweetBox/TweetBox";
import { useSelector } from "react-redux";
import { postType } from "../../Types/Feed.types";
import { RootState } from "../../Redux/app/store";

function Feed({ profileExists }: { profileExists: string }) {
  const [allPosts, setAllPosts] = useState<postType[]>([]);
  const { tweetAdded, dataChanged } = useSelector(
    (state: RootState) => state.global
  );
  const { twitterContract, profile, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );

  useEffect(() => {
    (async () => {
      const tweetUrls = await twitterContract
        ?.queryFilter("Tweet", 0, "latest")
        .then((events) =>
          events.map((event: any) => {
            if (event?.args) return event?.args[1];
          })
        );

      Promise.all(
        (await tweetUrls?.map(async (tokenUri: string): Promise<postType> => {
          const metadata = (await fetch(tokenUri).then((res) =>
            res.json()
          )) as postType;
          let a = tokenUri.split("/");
          return { ...metadata, ipfsHash: a[a.length - 1] };
        })) as Promise<postType>[]
      )
        .then((results) => {
          console.log("All data fetched successfully:");
          let temArr = results.reverse();
          setAllPosts(temArr);
        })
        .catch((error) => {
          console.error("One of the fetches failed:", error);
        });
    })();
  }, [tweetAdded, dataChanged]);

  return (
    <div className="  col-span-7  max-h-screen overflow-scroll border-[0.1rem] no-scrollbar lg:col-span-5 dark:border-slate-500 ">
      <div className="flex justify-between p-2 ">
        <h2>Home</h2>
        <HiOutlineRefresh />
      </div>
      <TweetBox />
      {profileExists &&
        allPosts?.map((post) => {
          return <DisplayTweets key={uuidv4()} post={post} profile={profile} />;
        })}
    </div>
  );
}

export default Feed;
