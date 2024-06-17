import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ProfileSection from "./ProfileSection";
import { useSelector } from "react-redux";
import { profileType } from "../../Types/Feed.types";
import { RootState } from "../../Redux/app/store";
import { tokenUriType } from "../../Types/blockchain.types";

type onlineUserType = {
  userId: string;
  socketId: string;
};

function MessageSearch({ profiles }: { profiles: tokenUriType[] }) {
  const [search, setSearch] = useState("");
  const onlineUsers = useSelector((state: any) => state.global.onlineUsers);
  const { profile } = useSelector((state: RootState) => state.blockchain);
  const sessionUserId = profile.userId;
  return (
    <div className=" col-span-2 m-2 flex flex-col gap-2  ">
      <h1 className="text-[1.4rem] font-bold ">Messages</h1>
      <div className=" flex items-center justify-center gap-2 rounded-full border-2 p-2 text-gray-400 ">
        <AiOutlineSearch />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[10rem] text-[0.8rem] outline-none dark:bg-black "
          placeholder="Search Profile To Message"
        ></input>
      </div>
      <div className="flex flex-col gap-2 bg-gray-50 dark:bg-black ">
        {profiles
          ?.filter(
            (profile) =>
              (search ? profile?.userId?.includes(search) : true) &&
              profile?.userId != sessionUserId
          )
          .map((profile) => {
            // console.log({ profile });
            let online: Boolean = false;
            onlineUsers.map((user: onlineUserType) => {
              if (user.userId === profile.userId) {
                online = true;
              }
            });
            return (
              <ProfileSection
                key={profile.address}
                profile={profile}
                online={online}
              />
            );
          })}
      </div>
    </div>
  );
}

export default MessageSearch;
