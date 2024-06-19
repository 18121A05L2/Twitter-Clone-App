import React, { useState } from "react";
import { BiX } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { modalStateChainging } from "../../../Redux/features/CommentSlice";
import { clicked } from "../../../Redux/features/GlobalSlice";
import Icons from "../Icons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import axiosAPI from "../../../axios";
import { RootState } from "../../../Redux/app/store";

type replyState = {
  postId: string;
  replyData: string;
  avatar: string | null | undefined;
  userId: string | null | undefined;
  tweetUserId: string;
  userName: string;
};

export default function CommentModal() {
  const [reply, setReply] = useState("");

  // ------------------------   Redux ----------------------------------
  const { modalState, post } = useSelector((state: any) => state.comment);
  const { profile } = useSelector((state: RootState) => state.blockchain);

  const dispatch = useDispatch();

  const data: replyState = {
    postId: post?._id,
    replyData: reply,
    avatar: profile.avatar,
    userId: profile.userId,
    tweetUserId: post?.userId,
    userName: post?.userName,
  };

  function handleReply() {
    axiosAPI.post("/comments", JSON.stringify(data)).then(() => {
      setReply("");
      dispatch(clicked());
      console.log("reply added successfully");
    });
    dispatch(modalStateChainging());
  }

  return (
    <div
      className={` absolute inset-0 flex justify-center bg-black/30  ${
        modalState ? "inline" : "hidden"
      } `}
    >
      <div className="mt-20 flex  h-[25rem] max-h-[30rem] min-w-[35rem] flex-col rounded-xl  bg-white p-3">
        <BiX
          onClick={() => dispatch(modalStateChainging())}
          title="Close"
          className="h-[2rem] w-[2rem] rounded-full hover:bg-gray-300   "
        />

        <section className="flex py-8  ">
          <div className="flex w-[3rem] flex-col  items-center">
            <Image
              className="rounded-full"
              src={post?.avatar || "https://links.papareact.com/gll"}
              width="45"
              height="45"
              alt="avatar"
            ></Image>
            <div className="my-2 h-[3rem] border-[0.1rem]"></div>
            <Image
              className="rounded-full"
              src={profile.avatar || "https://links.papareact.com/gll"}
              width="45"
              height="45"
              alt="avatar"
            ></Image>
          </div>
          <div className="p-2">
            <section className="flex ">
              <h1 className="pr-2 font-bold">{post?.userName}</h1>
              <p className="pr-2 text-gray-500">{post?.userId} . </p>
              {/* <Moment className="text-gray-500" fromNow>
                {post?.createdAt}
              </Moment> */}
            </section>
            <p className="max-w-[28rem]">{post?.userInput}</p>
            <p className="flex p-3">
              Replying to{" "}
              <span className="px-2 text-twitter">{post?.userId}</span>
            </p>
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="focus text-[1.3rem] outline-none"
              autoFocus
              type="text"
              placeholder={`Tweet your reply ${profile.userId} `}
            ></input>
          </div>
        </section>

        {/* ---------------------  Bottom Part -------------------------------     */}

        <div className="mt-auto flex gap-32">
          <Icons />
          <div
            onClick={handleReply}
            className={`cursor-pointer rounded-full bg-twitter p-1 px-4 font-bold text-white ${
              reply ? "opacity-100" : "opacity-50"
            } `}
          >
            Reply
          </div>
        </div>
      </div>
    </div>
  );
}
