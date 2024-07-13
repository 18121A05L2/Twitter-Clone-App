import React from "react";
import { BsThreeDots } from "react-icons/bs";
import Image from "next/image";
import Moment from "react-moment";
import Actions from "./Feed/DisplayTweets/Actions";
import { commentType } from "../Types/Feed.types";

function CommentDesign({ data }: { data: commentType }) {
  return (
    <div className="flex border-b-2 gap-4 items-start p-2">
      <Image
        className=" max-h-[1rem] rounded-full  "
        width={50}
        height={50}
        src={data.avatar}
      ></Image>
      <div className="w-full">
        <section className=" flex gap-2  ">
          <p className="font-bold ">{data.userName}</p>
          <p className="text-gray-500">@{data.userId} . </p>
          <Moment fromNow>{data?.createdAt}</Moment>
          <BsThreeDots className="ml-auto" />
        </section>
        <p>
          Replying to <span className="text-twitter">{data?.tweetUserId}</span>
        </p>
        <p>{data?.replyData}</p>
        <Actions />
      </div>
    </div>
  );
}

export default CommentDesign;
