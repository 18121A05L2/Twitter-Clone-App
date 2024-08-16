import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Profile from "../../components/Profile";
import Widgets from "../../components/Widgets/Widgets";
import TweetBoxModal from "../../components/Feed/TweetBox/TweetBoxModal";
import CommentModal from "../../components/Feed/DisplayTweets/CommentModal";
import Bookmarks from "../../components/unused/Bookmarks";
import Lists from "../../components/unused/Lists";
import Explore from "../../components/unused/Explore";
import Messages from "../../components/Messages/MessagesPage";
import Notifications from "../../components/unused/Notifications";
import Search from "../../components/unused/Search";
import Feed from "../../components/Feed/Feed";
import FundMe from "../../components/EthersFundMe";
import Wallet from "../../components/Wallet";
import { useRouter } from "next/router";
import EditProfileModal from "../../components/EditProfileModal";
import MessageSearch from "../../components/Messages/MessageSearch";
import Head from "next/head";
import NftProfile from "../../components/NftProfile";
import Nft from "../../components/Nft";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { tweetBoxModal } from "../../Redux/features/GlobalSlice";
import { setProfile } from "../../Redux/features/BlockchainSlice";
import useContracts from "../../components/hooks/useContracts";
import DarkMode from "../../components/utils/darkMode";
import SpecificTweetDisplay from "../../components/SpecificTweetDisplay";
import MarketPlace from "../../components/Nfts/MarketPlace/MarketPlace";
import { NewTwitterLogo } from "../../components/utils/svgs";
import { AiTwotoneThunderbolt } from "react-icons/ai";

function All() {
  const { isContractsLoading } = useContracts();
  const router = useRouter();

  const { profile } = useSelector((state: RootState) => state.blockchain);
  const { editProfileModalState, tweetBoxModalState, isDarkMode } = useSelector(
    (state: RootState) => state.global
  );

  useEffect(() => {
    const nextElement = document.getElementById("__next");
    if (nextElement) {
      nextElement.classList.add("dark:bg-black");
    }
  }, []);

  const switchComponent = (path: string | undefined) => {
    if (path && path?.split("/")?.length > 2) {
      if (path?.includes("home/status")) {
        return <SpecificTweetDisplay />;
      } else if (path?.includes("messages/")) {
        return <Messages />;
      }
    }
    switch (path) {
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
      case "marketplace":
        return <MarketPlace />;

      default:
        return <div>Not Found</div>;
    }
  };

  if (isContractsLoading)
    return (
      <div className=" flex h-screen w-screen items-center justify-center">
        <div className="relative ml-4 h-[7rem] w-[7rem] rounded-full p-[0.3rem] hover:bg-blue-200 ">
          <NewTwitterLogo
            isDarkMode={isDarkMode}
            className=" animate-bounce "
          />
          {/* <AiTwotoneThunderbolt className=" w-40 h-40 animate-bounce" /> */}
        </div>
      </div>
    );

  const componentName =
    router.asPath.split("/").length < 3
      ? router.query.component && router.query.component[0]
      : router.asPath;

  return (
    <div className=" mx-auto max-h-screen  max-w-7xl overflow-hidden  dark:text-white ">
      <DarkMode />
      <Head>
        <title>{router?.query?.component && router.query.component[0]}</title>
      </Head>
      <main className="grid grid-cols-9 ">
        <SideBar />
        <div className=" col-span-7 max-h-screen  border-x-[0.1rem] p-2 lg:col-span-5 dark:border-slate-500  ">
          {" "}
          {switchComponent(componentName)}
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
