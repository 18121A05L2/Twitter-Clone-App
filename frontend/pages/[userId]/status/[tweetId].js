import React from "react";

import SideBar from "../../../components/SideBar/SideBar";
import Widgets from "../../../components/Widgets/Widgets";
import CommentModal from "../../../components/Feed/DisplayTweets/CommentModal";
import TweetBoxModal from "../../../components/Feed/TweetBox/TweetBoxModal";
import SpecificTweetDisplay from "../../../components/SpecificTweetDisplay";
import axiosAPI from "../../../axios";
import useContracts from "../../../components/hooks/useContracts";

function specificTweet({ post }) {
  const { isContractsLoading } = useContracts();
  if (isContractsLoading) return <div>Loading </div>;
  return (
    <div className=" mx-auto max-h-screen max-w-7xl overflow-hidden">
      <main className="grid grid-cols-9 ">
        <SideBar />
        <SpecificTweetDisplay post={post} />
        <Widgets />
        <CommentModal />
        <TweetBoxModal />
      </main>
    </div>
  );
}

export default specificTweet;

export async function getServerSideProps(context) {
  const ipfsHash = context?.params?.tweetId;
  console.log({ ipfsHash });

  console.log("🥶 this is context" + context);
  const post = "";

  // const post = await axiosAPI
  //   .post("/tweet", JSON.stringify(data))
  //   .then((res) => res.data);

  return {
    props: {
      post: post,
    },
  };
}
