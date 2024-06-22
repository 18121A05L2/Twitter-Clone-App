import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
// import ProfileSection from "./ProfileSection.jsx";
import ViewProfile from "./ViewProfile";
import { RootState } from "../../Redux/app/store";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import MessageSearch from "../Messages/MessageSearch";
import useUniqueAddresses from "../hooks/useUniqueAddresses";
import { nftPostType } from "../../Types/blockchain.types";

function Widgets() {
  const [search, setSearch] = useState<string>("");
  const [profiles, setProfiles] = useState<nftPostType[]>([]);
  const { nftContract, twitterContract } = useSelector(
    (state: RootState) => state.blockchain
  );
  const router = useRouter();
  const { uniqueAddresses, isLoading: isAdressesLoading } =
    useUniqueAddresses();

  const isMessagesPage =
    router?.query?.component && router?.query?.component[0] === "messages";
  function clearInput() {
    setSearch("");
  }
  useEffect(() => {
    const getEventsData = async () => {
      await twitterContract
        ?.queryFilter("TransferNft", 0, "latest")
        .then((events) => {
          Promise.all(
            uniqueAddresses.map(async (address): Promise<nftPostType> => {
              const profileUrl = await twitterContract.getProfile(address);
              const profileData = (await fetch(profileUrl).then((res) =>
                res.json()
              )) as nftPostType;
              return { ...profileData, address };
            })
          ).then((results) => setProfiles(results));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getEventsData();
  }, [nftContract, isAdressesLoading]);
  // console.log({ profiles });

  return (
    <>
      {isMessagesPage ? (
        <MessageSearch profiles={profiles} />
      ) : (
        <div className=" col-span-2 m-2 hidden pt-2 lg:inline ">
          <div className="flex  rounded-full bg-gray-200 p-2 text-gray-500 dark:bg-black dark:border-2">
            <IoSearch className="h-[2rem] w-[2rem]   " />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-200 outline-none  dark:bg-black "
              type="text"
              placeholder="Search Twitter"
            />
          </div>
          {search && (
            <div className=" mt-2 flex min-h-[25rem]   flex-col gap-3 rounded-lg p-2 shadow-[2px_4px_12px_6px_rgba(118,217,255,0.5)] ">
              {profiles?.filter((profile) => profile.userId?.includes(search))
                .length ? (
                profiles
                  ?.filter((profile) => profile.userId?.includes(search))
                  .map((profile) => (
                    // <ProfileSection key={profile._id} profile={profile} />
                    <ViewProfile
                      key={profile.address}
                      profile={profile}
                      clearInput={clearInput}
                    />
                  ))
              ) : (
                <div className=" p-4"> no results found for {search} </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Widgets;
