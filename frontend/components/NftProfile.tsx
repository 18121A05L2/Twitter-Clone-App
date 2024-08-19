import React, { useEffect, useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { useDispatch, useSelector } from "react-redux";
import "dotenv/config";
import { RootState } from "../Redux/app/store";

import axiosAPI, { localhost } from "../axios";
import {
  setCurrentNftView,
  setIsSettingProfile,
  setProfile,
} from "../Redux/features/BlockchainSlice";
import Link from "next/link";
import { toast } from "react-toastify";
import { PINATA_GATEWAY_URL } from "../utils/constants";
import { nftPostType } from "../Types/blockchain.types";
import { AiTwotoneThunderbolt } from "react-icons/ai";

function NftProfile() {
  const [nftName, setNftName] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [tempImg, setTempImg] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [myNfts, setMyNfts] = useState<nftPostType[]>([]);
  const dispatch = useDispatch();
  const {
    walletAddress,
    twitterContract,
    nftContract,
    profile,
    isSettingProfile,
  } = useSelector((state: RootState) => state.blockchain);
  const [userId, setUserId] = useState(profile.userId);
  const [isUserIdEditable, setIsUserIdEditable] = useState(
    profile.userId ? false : true
  );

  useEffect(() => {
    loadMyNfts();
  }, [nftContract, isMinting]);

  const loadMyNfts = async () => {
    const nftIds = await nftContract?.getMyNfts();
    if (nftIds) {
      const nfts = await Promise.all(
        nftIds.map(async (nftNumber: number) => {
          const uri = await nftContract?.tokenURI(Number(nftNumber));
          const metadata = await axiosAPI
            .get(uri)
            .then((res) => res.data)
            .catch((err) => console.log(err));
          // TODO: need to look in to this, why metadata has been printing as randam blah blah
          // console.log(metadata);
          return metadata;
        })
      );
      setMyNfts(nfts);
    }
  };

  const MintNft = async () => {
    if (!tempImg || !nftName || !userId) {
      if (!tempImg && !nftName && !userId) {
        toast("Please select an image , enter nft name and userId", {
          type: "error",
        });
      } else if (!tempImg && !nftName) {
        toast("Please select an image , enter nft name ", { type: "error" });
      } else if (!tempImg && !userId) {
        toast("Please select an image , enter userId", { type: "error" });
      } else if (!nftName && !userId) {
        toast("Please enter nft name and userId", { type: "error" });
      } else if (!tempImg) {
        toast("Please select an image", { type: "error" });
      } else if (!nftName) {
        toast("Please enter nft name", { type: "error" });
      } else if (!userId) {
        toast("Please enter userId", { type: "error" });
      }
      return;
    }
    setIsMinting(true);
    try {
      const formData = new FormData();
      formData.append("image", tempImg);
      const imgUploadRes = await axios
        .post(`${localhost}/uploadImageToIpfs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
      let nextNftId = Number(await nftContract?.nextTokenIdToMint());
      const nftData: nftPostType = {
        avatar: `${PINATA_GATEWAY_URL}/${imgUploadRes.IpfsHash}`,
        nftName,
        userId,
        nftId: nextNftId,
        address: walletAddress,
      };

      const jsonRes = await axiosAPI
        .post("/uploadJsonToIpfs", JSON.stringify(nftData))
        .then((res) => res.data);
      let nftDataUri = `${PINATA_GATEWAY_URL}/${jsonRes.IpfsHash}`;

      const profileData = {
        ...profile,
        avatar: `${PINATA_GATEWAY_URL}/${imgUploadRes.IpfsHash}`,
        nftName,
        userId,
        nftId: nextNftId,
      };
      const profileTokenRes = await axiosAPI
        .post("/uploadJsonToIpfs", JSON.stringify(profileData))
        .then((res) => res.data);
      let profileTokenUri = `${PINATA_GATEWAY_URL}/${profileTokenRes.IpfsHash}`;
      console.log({ profileTokenUri });
      await (await nftContract?.mintTo(nftDataUri, profileTokenUri)).wait();
      const nftUri = await twitterContract?.getProfile(walletAddress);
      const profileRes = await fetch(nftUri).then((res) => res.json());
      console.log({ profileRes });
      dispatch(setProfile({ ...profileRes, address: walletAddress }));
      setIsUserIdEditable(profile.userId ? false : true);
      setTempImg(null);
      setNftName("");
      setImageUrl("");
      toast("Minted Successfully", { type: "success" });
    } catch (error: any) {
      console.log(error);
      toast(`Mint Failed :${error.shortMessage} `, { type: "error" });
    }
    await loadMyNfts();
    setIsMinting(false);
  };

  const onImgChange = async (event: any) => {
    event.preventDefault();
    let file = event.target.files[0];
    setTempImg(file);
    if (file) {
      let imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

  const switchProfile = async (event: any, nft: nftPostType) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setIsSettingProfile(true));
    try {
      const newTokenURI = await nftContract?.tokenURI(nft.nftId);
      const newProfileData = await fetch(newTokenURI).then((res) => res.json());
      const newData = {
        ...profile,
        ...newProfileData,
        userId: profile.userId,
      };
      const jsonRes = await axiosAPI
        .post("/uploadJsonToIpfs", JSON.stringify(newData))
        .then((res) => res.data);
      let tokenUri = `${PINATA_GATEWAY_URL}/${jsonRes.IpfsHash}`;

      await (await twitterContract?.setProfile(tokenUri, nft.nftId)).wait();
      const nftUri = await twitterContract?.getProfile(walletAddress);
      const profileRes = await fetch(nftUri).then((res) => res.json());
      dispatch(setProfile({ ...profileRes, address: walletAddress }));
      dispatch(setIsSettingProfile(false));
    } catch (err: any) {
      toast(err.shortMessage, { type: "error" });
    } finally {
      dispatch(setIsSettingProfile(false));
    }
  };

  const nftOnclick = async (nft: nftPostType) => {
    dispatch(setCurrentNftView(nft));
  };

  return (
    <div className=" no-scrollbar flex max-h-screen flex-col gap-5 overflow-y-scroll">
      <div className=" flex flex-col gap-3 ">
        <div className=" flex flex-row">
          <div className=" flex flex-col gap-3 ">
            <h1>NftProfile</h1>
            <input
              className=""
              onChange={onImgChange}
              type="file"
              accept="image/*"
            ></input>
            <input
              className=" rounded-md border-2 p-1 outline-none dark:bg-black "
              type="text"
              placeholder="NFT name "
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
            ></input>
            <div className=" flex items-center gap-5 ">
              <input
                className={` rounded-md border-2 p-1 w-max outline-none dark:bg-black ${!isUserIdEditable && " cursor-not-allowed opacity-30"} `}
                type="text"
                placeholder="user id "
                value={userId}
                readOnly={!isUserIdEditable}
                onChange={(e) => setUserId(e.target.value)}
              ></input>
              <div
                className={` bg-red-300 p-1 rounded-md cursor-pointer ${isUserIdEditable && " opacity-30"}`}
                onClick={() => {
                  if (!isUserIdEditable) setIsUserIdEditable(!isUserIdEditable);
                }}
              >
                Edit userId
              </div>
            </div>

            <div
              onClick={MintNft}
              className=" max-w-40 py-2  cursor-pointer rounded-md bg-blue-200 px-4 dark:text-black "
            >
              {isMinting ? "Minting...." : "Mint NFT Profile"}
            </div>
          </div>
          {isSettingProfile ? (
            <div className=" ml-auto mr-auto flex h-24 w-24 items-center self-center rounded-full bg-indigo-400 text-xs">
              <svg
                className=" mr-3 h-5 w-5 animate-spin "
                viewBox="0 0 24 24"
              ></svg>
              setting profile..
            </div>
          ) : (
            <img
              className=" ml-auto mr-auto h-24 w-24 self-center rounded-full border-2 border-blue-500   "
              src={profile?.avatar || "https://links.papareact.com/gll"}
              alt="Mint an NFT"
            ></img>
          )}
        </div>

        {imageUrl && (
          <img
            alt="profile"
            className={`h-80 w-80 align-middle ${isMinting && "animate-pulse"} `}
            src={imageUrl}
          ></img>
        )}
      </div>
      <div className=" flex flex-col border-2 py-3 ">
        <h1 className=" text-center pb-2 "> Owned NFTS</h1>
        <section className=" grid grid-cols-3 gap-3 p-2 ">
          {/* NFT cards */}
          {myNfts.length > 0 ? (
            myNfts.map((nft, i) => {
              if (!nft) return null;
              return (
                <Link
                  className=" cursor-pointer "
                  passHref
                  href={`/nft`}
                  key={i}
                >
                  <div
                    key={i}
                    className=" flex cursor-pointer flex-col  items-center rounded-lg  "
                    onClick={() => nftOnclick(nft)}
                  >
                    <img className=" h-40 w-40 rounded" src={nft.avatar} />
                    <p className=" py-2 text-center ">
                      <a href="">{`#${nft.nftId}`}</a>
                      {` - `} {nft.nftName}
                    </p>
                    <div
                      onClick={(event) => switchProfile(event, nft)}
                      className=" cursor-pointer rounded-lg bg-slate-400 px-2"
                    >
                      Set as NFT profile
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className=" w-full flex justify-center h-40 items-center ">
              <AiTwotoneThunderbolt className=" w-24 h-24 animate-bounce ml-auto" />
            </div>
          )}
        </section>
      </div>
      <Link href="/marketplace">
        <div className=" bg-yellow-300 p-3 rounded-xl w-fit cursor-pointer dark:text-black mb-6 ">
          {" "}
          Go to MarketPlace{" "}
        </div>
      </Link>
    </div>
  );
}

export default NftProfile;
