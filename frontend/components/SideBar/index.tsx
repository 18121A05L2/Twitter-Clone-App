import React from "react";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { BiHash } from "react-icons/bi";
import { FiMail } from "react-icons/fi";
import { BsBookmark, BsCardList } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { CgMoreO } from "react-icons/cg";
import { CiWallet } from "react-icons/ci";
import SideBarItem from "./SideBarItem";
import Link from "next/link";
import { tweetBoxModal } from "../../Redux/features/GlobalSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { FaDonate } from "react-icons/fa";
import { FcSafe } from "react-icons/fc";
import { RootState } from "../../Redux/app/store";
import { setWalletAddress } from "../../Redux/features/BlockchainSlice";
import { NewTwitterLogo } from "../utils/svgs";
import { useRouter } from "next/router";

function SideBar() {
  const dispatch = useDispatch();
  const { profile, isSettingProfile, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  const { isDarkMode } = useSelector((state: RootState) => state.global);
  const router = useRouter();

  function connectWallet() {
    if (window.ethereum) {
      (async () => {
        const { ethereum } = window;
        const connectedAccounts = (await ethereum.request({
          method: "eth_requestAccounts",
        })) as Array<string>;
        console.log(connectedAccounts);
        const walletAddress = connectedAccounts[0];
        dispatch(setWalletAddress(walletAddress));
        window.sessionStorage.setItem("walletAddress", walletAddress);
      })();
    }
  }

  return (
    <div className="col-span-2 flex h-screen flex-col pt-2  ">
      <div className="flex max-w-[12rem] flex-col items-center gap-1  lg:items-start ">
        <Link passHref href="/home">
          <div
            onClick={() => router.push("/")}
            className="relative ml-4 h-[3rem] w-[3rem] rounded-full p-[0.3rem] hover:bg-blue-200 "
          >
            <NewTwitterLogo isDarkMode={isDarkMode} />
          </div>
        </Link>

        <SideBarItem Icon={AiOutlineHome} text="Home" />
        {/* <SideBarItem Icon={IoSearch} text="Search" /> */}
        {/* <SideBarItem Icon={BiHash} text="Explore" /> */}
        {/* <SideBarItem Icon={IoNotificationsOutline} text="Notifications" /> */}
        <SideBarItem Icon={FiMail} text="Messages" />
        {/* <SideBarItem Icon={BsBookmark} text="Bookmarks" /> */}
        {/* <SideBarItem Icon={BsCardList} text="Lists" /> */}
        <SideBarItem Icon={HiOutlineUser} text="Profile" />
        {/* <SideBarItem Icon={CgMoreO} text="More" /> */}
        <SideBarItem Icon={FaDonate} text="FundMe" />
        <SideBarItem Icon={CiWallet} text="Wallet" />
        <SideBarItem Icon={FcSafe} text="NFTProfile" />
        <div
          onClick={() => dispatch(tweetBoxModal())}
          className=" tweetButton mt-5 "
        >
          Tweet
        </div>
        <div
          onClick={connectWallet}
          className=" tweetButton mt-5 bg-green-500 "
        >
          {walletAddress
            ? walletAddress.slice(0, 7) +
              "......" +
              walletAddress.slice(
                walletAddress.length - 7,
                walletAddress.length
              )
            : "Connect wallet"}
        </div>
      </div>
      <div className="signout">
        <div className="relative h-[2.5rem] w-[2.5rem]">
          {isSettingProfile ? (
            <div className=" ml-auto mr-auto flex h-14 w-14 items-center self-center rounded-full bg-indigo-400 text-xs">
              <svg
                className=" mr-3 h-5 w-5 animate-spin "
                viewBox="0 0 24 24"
              ></svg>
              setting profile..
            </div>
          ) : (
            <Image
              layout="fill"
              className=" rounded-full"
              src={profile.avatar || "https://links.papareact.com/gll"}
            ></Image>
          )}
        </div>

        {/* <p>@{session?.user?.name?.split(" ")[0].toLowerCase()}</p> */}

        {walletAddress && (
          <button
            onClick={async () => {
              await window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [
                  {
                    eth_accounts: {},
                  },
                ],
              });
              router.push("/");
            }}
            className="rounded-full bg-twitter bg-opacity-60 p-1 px-2 transition hover:scale-125"
          >
            disconnect
          </button>
        )}
      </div>
    </div>
  );
}

export default SideBar;
