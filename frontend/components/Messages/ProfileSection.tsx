import React from "react";
import Image from "next/image";
import Link from "next/link";
import axiosAPI from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { setReceiverProfile } from "../../Redux/features/GlobalSlice";

type propsType = {
  profile: tokenUriType;
  online: Boolean;
};

function ProfileSection({ profile, online }: propsType) {
  const { profile: currentProfile } = useSelector(
    (state: RootState) => state.blockchain
  );
  const dispatch = useDispatch();
  const arr = [
    profile?.userId.toLowerCase(),
    currentProfile?.userId?.toLocaleLowerCase(),
  ].sort();
  const conversationId = arr[0] + "-" + arr[1];

  async function conversationCreation() {
    dispatch(setReceiverProfile(profile));
    await axiosAPI.post(
      "/conversation/creation",
      JSON.stringify({ conversationId: conversationId })
    );
  }
  const walletAddress = profile?.address;

  return (
    <Link passHref href={`/messages/${conversationId}`}>
      <div
        onClick={conversationCreation}
        className=" relative  flex h-[5rem]  cursor-pointer items-center gap-2 rounded-xl border-[0.1rem] px-2 hover:bg-gray-200"
      >
        {online && (
          <span className="absolute left-0 top-0 flex h-[1rem] w-[1rem] rounded-full bg-twitter  ">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          </span>
        )}

        <div className="relative h-[3rem] w-[3rem] ">
          <Image
            layout="fill"
            className="rounded-full "
            src={profile?.avatar || "https://links.papareact.com/gll"}
            alt="image"
          ></Image>
        </div>

        <div className=" flex flex-col py-6  ">
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
          </section>
          <p className="text-gray-500">
            {profile?.userId?.length < 15
              ? profile?.userId
              : profile?.userId?.slice(0, 15) + "..."}
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

export default ProfileSection;
