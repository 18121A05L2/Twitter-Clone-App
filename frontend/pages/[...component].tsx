import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import Profile from "../components/Profile";
import Widgets from "../components/Widgets";
import TweetBoxModal from "../components/Feed/TweetBox/TweetBoxModal";
import CommentModal from "../components/Feed/DisplayTweets/CommentModal";
import Bookmarks from "../components/unused/Bookmarks";
import Lists from "../components/unused/Lists";
import Explore from "../components/unused/Explore";
import Messages from "../components/Messages";
import Notifications from "../components/unused/Notifications";
import Search from "../components/unused/Search";
import Feed from "../components/Feed";
import FundMe from "../components/EthersFundMe";
import Wallet from "../components/Wallet";
import { useRouter } from "next/router";
import EditProfileModal from "../components/EditProfileModal";
import MessageSearch from "../components/Messages/MessageSearch";
import Head from "next/head";
import NftProfile from "../components/NftProfile";
import Nft from "../components/Nft";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/app/store";
import { tweetBoxModal } from "../Redux/features/GlobalSlice";
import { setProfile } from "../Redux/features/BlockchainSlice";
import useContracts from "../components/hooks/useContracts";
import DarkMode from "../components/utils/darkMode";

function All() {
  const { isContractsLoading } = useContracts();
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile, walletAddress, nftContract } = useSelector(
    (state: RootState) => state.blockchain
  );
  const { editProfileModalState, tweetBoxModalState } = useSelector(
    (state: RootState) => state.global
  );
  // useEffect(() => {
  //   (async () => {
  //     if (walletAddress && nftContract?.getProfile) {
  //       const nftUri = await nftContract?.getProfile(walletAddress);
  //       const profileRes = await fetch(nftUri).then((res) => res.json());
  //       dispatch(setProfile(profileRes));
  //     }
  //   })();
  // }, [walletAddress, nftContract]);

  useEffect(() => {
    const nextElement = document.getElementById("__next");
    if (nextElement) {
      nextElement.classList.add("dark:bg-black");
    }
  }, []);

  const switchComponent = (arg: string | undefined) => {
    switch (arg) {
      case "profile":
        return <Profile />;
      case "lists":
        return <Lists />;
      case "bookmarks":
        return <Bookmarks />;
      case "explore":
        return <Explore />;
      case "messages":
        return <Messages />;
      case "notifications":
        return <Notifications />;
      case "search":
        return <Search />;
      case "home":
        return <Feed profileExists={profile.avatar} />;
      case "fundme":
        return <FundMe />;
      case "wallet":
        return <Wallet />;
      case "nftprofile":
        return <NftProfile />;
      case "nft":
        return <Nft />;
      default:
        return <div>Not Found</div>;
    }
  };

  if (isContractsLoading) return <div>Loading</div>;
  return (
    <div className=" mx-auto max-h-screen  max-w-7xl overflow-hidden dark:bg-black dark:text-white ">
      <DarkMode />
      <Head>
        <title>{router?.query?.component && router.query.component[0]}</title>
      </Head>
      <main className="grid grid-cols-9 ">
        <SideBar />
        <div className=" col-span-7 max-h-screen  border-x-[0.1rem] p-2 lg:col-span-5 ">
          {" "}
          {switchComponent(router.query.component && router.query.component[0])}
        </div>

        <Widgets />
        <CommentModal />
        {(tweetBoxModalState || !profile.avatar) && (
          <TweetBoxModal profileExists={profile.avatar} />
        )}

        {editProfileModalState && <EditProfileModal />}
      </main>
    </div>
  );
}

export default All;
