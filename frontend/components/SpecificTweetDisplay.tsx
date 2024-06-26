import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Actions from "./Feed/DisplayTweets/Actions";
import CommentDesign from "./CommentDesign";
import { clicked } from "../Redux/features/GlobalSlice";
import { useRouter } from "next/router";
import axiosAPI from "../axios";
import { postType } from "../Types/Feed.types";
import { RootState } from "../Redux/app/store";
import { PINATA_GATEWAY_URL } from "../utils/constants";

function SpecificTweetDisplay() {
  const [replyInput, setReplyInput] = useState("");
  const [post, setPost] = useState<postType>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.blockchain);
  const ipfsHash = router.asPath.split("/").pop();
  const postUrl = `${PINATA_GATEWAY_URL}/${ipfsHash}`;
  useEffect(() => {
    if (postUrl) {
      (async () => {
        const profileRes = await fetch(postUrl).then((res) => res.json());
        setPost(profileRes);
      })();
    }
  }, [postUrl]);

  console.log(post);

  const data = {
    postId: post?._id,
    replyData: replyInput,
    avatar: profile.avatar,
    userId: profile.userId?.split(" ")[0].toLocaleLowerCase(),
    tweetUserId: post?.userId,
    // userName: post?.userName,
  };

  async function handleReply() {
    axiosAPI.post("/comments", JSON.stringify(data)).then(() => {
      setReplyInput("");
      dispatch(clicked());
      console.log("reply added successfully");
    });
  }

  if (!post && !profile) return null;

  return (
    <div className=" scrollbar-hide col-span-7 mr-2 max-h-screen  overflow-scroll border-x-[0.1rem] p-2 lg:col-span-5 ">
      <section className="mb-2 flex items-center gap-6">
        <a>
          <IoArrowBackSharp
            onClick={() => router.back()}
            title="back"
            className="cursor-pointer rounded-full p-1 text-[2.3rem] hover:bg-gray-300"
          />
        </a>

        <p className="text-[1.3rem] font-bold text-black">Tweet</p>
      </section>

      <div className="flex items-center gap-4 ">
        <Image
          className="rounded-full"
          height={50}
          width={50}
          src={post?.avatar || "https://links.papareact.com/gll"}
          alt="user image"
        ></Image>
        <div>
          <p className="font-[600]">{post?.userId}</p>
          <p className="text-gray-500">{post?.userId}</p>
        </div>
        <BsThreeDots className="ml-auto text-gray-600" />
      </div>
      <p className="p-3 text-[1.5rem]">{post?.userInput}</p>
      <div className="flex gap-4 border-y-2 p-2 ">
        <p>{post?.comments?.length} Comments</p>
        <p>{post?.likes?.length} Likes</p>
      </div>

      <Actions post={post} />
      <div className="flex items-center gap-4 border-y-2 p-4 ">
        <Image
          className="rounded-full"
          src={profile.avatar || "https://links.papareact.com/gll"}
          width="45"
          height="45"
          alt="user image"
        ></Image>
        <input
          value={replyInput}
          onChange={(e) => setReplyInput(e.target.value)}
          className="outline-none"
          type="text"
          placeholder="Tweet Your Reply"
        ></input>
        <p
          className={`ml-auto rounded-full bg-twitter p-2 px-6 font-bold text-white ${
            replyInput || " opacity-50  "
          } `}
          onClick={handleReply}
        >
          Reply
        </p>
      </div>
      {post?.comments?.map((data) => (
        <CommentDesign key={uuidv4()} data={data} />
      ))}
    </div>
  );
}

export async function getServerSideProps(context: any) {
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

export default SpecificTweetDisplay;
