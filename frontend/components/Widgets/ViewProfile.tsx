import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa";
import { useRouter } from "next/router";
import { nftPostType } from "../../Types/blockchain.types";

function ViewProfile({
  profile,
  clearInput,
}: {
  profile: nftPostType;
  clearInput: () => void;
}) {
  function handleClick() {
    clearInput();
  }

  const walletAddress = profile?.address;

  function onCopyClick() {
    navigator.clipboard.writeText(walletAddress ? walletAddress : "");
  }

  const router = useRouter();
  const isMessagesPage =
    router?.query?.component && router?.query?.component[0] === "messages";

  return (
    <Link
      passHref
      href={
        !isMessagesPage
          ? `/profile?address=${profile?.address} `
          : "/messagages?address=${profile?.address}"
      }
    >
      <div
        onClick={handleClick}
        className="flex h-[5rem]  cursor-pointer items-center gap-2 rounded-xl border-[0.1rem] px-2 hover:bg-gray-200"
      >
        <div className="relative h-[3rem] w-[3rem]">
          <Image
            layout="fill"
            className="rounded-full "
            src={profile?.avatar}
            alt="avatar"
          ></Image>
        </div>

        <div className=" flex flex-col ">
          <section className=" flex items-center gap-3">
            <p>
              {walletAddress &&
                walletAddress.slice(0, 5) +
                  "......" +
                  walletAddress.slice(
                    walletAddress.length - 5,
                    walletAddress.length
                  )}
            </p>
            <FaRegCopy onClick={onCopyClick} />
          </section>

          <p className="text-gray-500">
            {profile?.userId.length < 15
              ? profile?.userId
              : profile?.userId.slice(0, 15) + "..."}
          </p>
          {/* <p className="text-gray-500">
            {profile?.bio?.length < 15
              ? profile?.bio
              : profile?.bio?.slice(0, 15) + "..."}
          </p> */}
        </div>
      </div>
    </Link>
  );
}

export default ViewProfile;
