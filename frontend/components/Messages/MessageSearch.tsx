import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ProfileSection from "./ProfileSection";
import { useSelector } from "react-redux";
import { profileType } from "../../Types/Feed.types";
import { RootState } from "../../Redux/app/store";
import { nftPostType } from "../../Types/blockchain.types";

type onlineUserType = {
  address: string;
  socketId: string;
};

function MessageSearch({ profiles }: { profiles: nftPostType[] }) {
  const [search, setSearch] = useState("");
  const onlineUsers = useSelector((state: any) => state.global.onlineUsers);
  const { profile } = useSelector((state: RootState) => state.blockchain);
  const sessionUserAddress = profile.address;
  return (
    <div className=" col-span-2 m-2 flex flex-col gap-2  ">
      <h1 className="text-[1.4rem] font-bold ">Messages</h1>
      <div className=" flex items-center gap-2 rounded-full border-2 p-2 text-gray-400 ">
        <AiOutlineSearch />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[15rem] text-[0.8rem] outline-none dark:bg-[linear-gradient(251.51deg,#194547_12.74%,#194547_98.57%)]  "
          placeholder="Search Profile To Message"
        ></input>
      </div>
      <div className="flex flex-col gap-2 bg-gray-100 dark:bg-[#BDE8CA]/70 rounded-md ">
        {profiles
          ?.filter(
            (profile) =>
              (search
                ? profile?.address?.includes(search.toLowerCase())
                : true) &&
              profile?.address?.toLowerCase() !=
                sessionUserAddress.toLowerCase()
          )
          .map((profile) => {
            let online: Boolean = false;
            onlineUsers.map((user: onlineUserType) => {
              if (user.address === profile.address) {
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
