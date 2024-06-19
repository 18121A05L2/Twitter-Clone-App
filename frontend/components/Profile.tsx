import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import DisplayTweets from "./Feed/DisplayTweets";
import { useDispatch, useSelector } from "react-redux";
import { editProfileModal } from "../Redux/features/GlobalSlice";
import { useRouter } from "next/router";
import { AiOutlineLink } from "react-icons/ai";
import axiosAPI from "../axios";
import { postType, profileType } from "../Types/Feed.types";
import { RootState } from "../Redux/app/store";
import { tokenUriType } from "../Types/blockchain.types";

function Profile() {
  const [profilePosts, setProfilePosts] = useState([]);
  const [profileData, setProfileData] = useState<tokenUriType>();
  const router = useRouter();
  const { profileDataChanged, dataChanged } = useSelector(
    (state: RootState) => state.global
  );
  const { profile } = useSelector((state: RootState) => state.blockchain);
  const newUserId = router?.query?.component && router?.query?.component[1];
  const userId = profile.userId;
  const dispatch = useDispatch();
  useEffect(() => {
    // ----------------------   profile creation if not exists ------------------------------------
    // async function profile() {
    //   const data = {
    //     userId: userId,
    //     userImage: profile.avatar,
    //     name: session?.user?.name,
    //   };
    //   const response = await axiosAPI.post("/profile", JSON.stringify(data));
    // }
    // profile();
    // -------------------------------------------- fetching Profile Data --------------------
    // async function fetchProfileData() {
    //   const profileData = await axiosAPI
    //     .post("/profiledata", JSON.stringify({ userId: userId }))
    //     .then(async (res) => await res.data);
    //   setProfileData(profileData);
    // }
    // fetchProfileData();
    setProfileData(profile);
  }, [router.query.component, profile, profileDataChanged]);

  useEffect(() => {
    async function fetchingProfilePosts() {
      const profilePosts = await axiosAPI
        .post("/profileposts", JSON.stringify({ userId: userId }))
        .then((res) => res.data);
      setProfilePosts(profilePosts);
    }
    fetchingProfilePosts();
  }, [dataChanged, router.query.component]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        <IoArrowBackSharp
          title="back"
          onClick={() => {
            router.back();
          }}
          className="cursor-pointer rounded-full p-1 text-[2.3rem] hover:bg-gray-300"
        />

        <section>
          <p>{profileData?.userId}</p>
          <p>{profilePosts?.length} Tweets</p>
        </section>
      </div>
      <div className="relative flex flex-col ">
        <img
          className="h-[12rem]"
          height="200"
          width="700"
          src={
            // profileData?.backgroundImage ||
            "https://thumbs.dreamstime.com/b/technology-banner-background-old-new-using-computer-circuits-old-machine-cogs-37036025.jpg"
          }
        />
        <div className="absolute left-[2rem] top-[8rem] h-[7rem] w-[7rem] rounded-full border-4 border-white">
          <Image
            className="rounded-full"
            layout="fill"
            src={profileData?.avatar || "https://links.papareact.com/gll"}
            alt="profile image"
          ></Image>
        </div>

        {newUserId && userId !== newUserId ? (
          ""
        ) : (
          <p
            onClick={() => {
              dispatch(editProfileModal());
            }}
            className=" ml-auto  mr-4 mt-2 cursor-pointer rounded-3xl border-[0.1rem] p-2 px-4 font-semibold "
          >
            Edit profile
          </p>
        )}
      </div>
      <div
        className={` flex flex-col gap-2 pl-4 ${
          newUserId && userId !== newUserId && " pt-12  "
        }`}
      >
        {/* <p>{profileData?.name}</p> */}
        <p>{profileData?.userId}</p>
        <p>{profileData?.bio}</p>

        <div className="flex gap-4   ">
          <div className="flex items-center gap-2  ">
            <MdOutlineBusinessCenter />
            <p>Community</p>
          </div>
          <div className=" flex items-center gap-2  ">
            <GoCalendar />
            <p>
              Joined
              {/* <Moment fromNow>{profileData.createdAt}</Moment> */}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineLink />
            <a
              // href={profileData?.website}
              target="_blank"
              className=" text-twitter "
            >
              {/* {profileData?.website?.slice(0, 20) + "..."} */}
            </a>
          </div>
        </div>
        <div className="mb-2 flex gap-4 pb-2">
          <div className="flex gap-2">
            <p className="font-bold">0</p>
            <p>Following</p>
          </div>
          <div className="flex gap-2">
            <p className="font-bold">0</p>
            <p>Followers</p>
          </div>
        </div>
      </div>
      {/* {profilePosts?.map((post: postType) => (
        <DisplayTweets key={post?._id} post={post} />
      ))} */}
    </div>
  );
}

export default Profile;
