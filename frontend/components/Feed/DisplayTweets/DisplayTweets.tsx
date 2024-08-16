import React from "react";
import Moment from "react-moment";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Link from "next/link";
import Actions from "./Actions";
import Image from "next/image";
import { postType, profileType } from "../../../Types/Feed.types";
import { nftPostType } from "../../../Types/blockchain.types";

function DisplayTweets({
  post,
  profile,
}: {
  post: postType;
  profile: nftPostType | profileType;
}) {
  return (
    <Link passHref href={`home/status/${post?.userId}/${post.ipfsHash}`}>
      <div
        className="flex  p-2 hover:bg-gray-100 bg-[#2AA3EF0A] rounded-2xl "
      >
        <div className="relative h-[3rem] w-[3.2rem] ">
          <Image
            layout="fill"
            className=" rounded-full "
            src={post.avatar || "https://links.papareact.com/gll"}
            alt="poat"
          ></Image>
        </div>

        <div className="w-full px-2 ">
          {/* Top  */}
          <section className="flex  items-center ">
            <p className=" text-sm text-gray-400">
              {post?.userId || "@tempUser"} {" posted "}
              <Moment fromNow>{post?.timeStamp}</Moment>{" "}
            </p>
            <BiDotsHorizontalRounded className="ml-auto h-[1.2rem] w-[1.2rem]" />
          </section>
          <section className="p-4">{post?.userInput}</section>
          {/* icons */}
          <Actions post={post} />
        </div>
      </div>
    </Link>
  );
}

export default DisplayTweets;
