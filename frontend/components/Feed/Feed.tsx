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
        tweetUrls?.map(async (tokenUri: string): Promise<postType | null> => {
          const metadata = (await fetch(tokenUri).then((res) => {
            if (res.status !== 200) return null;
            return res.json();
          })) as postType | null;
          let a = tokenUri.split("/");
          if (!metadata) return null;
          return { ...metadata, ipfsHash: a[a.length - 1] };
        }) as Promise<postType | null>[]
      )
        .then((results) => {
          console.log("All data fetched successfully:");
          const temArr: postType[] = results
            .filter((item): item is postType => item !== null)
            .reverse();
          setAllPosts(temArr);
        })
        .catch((error) => {
          console.error("One of the fetches failed:", error);
        });
    })();
  }, [tweetAdded, dataChanged]);

  return (
    <div className="  col-span-7  max-h-screen overflow-scroll flex flex-col gap-3 no-scrollbar lg:col-span-5 dark:border-slate-500 ">
      {/* <div className="flex justify-between p-2 ">
        <h2>Home</h2>
        <HiOutlineRefresh /> 
      </div> */}
      <TweetBox />
      {profileExists &&
        allPosts?.map((post) => {
          return <DisplayTweets key={uuidv4()} post={post} profile={profile} />;
        })}
    </div>
  );
}

export default Feed;
