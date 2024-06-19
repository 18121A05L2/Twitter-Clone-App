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

function NftProfile() {
  const [nftName, setNftName] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [tempImg, setTempImg] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [myNfts, setMyNfts] = useState<nftPostType[]>([]);
  const dispatch = useDispatch();
  const { walletAddress, twitterContract, profile, isSettingProfile } =
    useSelector((state: RootState) => state.blockchain);
  const [userId, setUserId] = useState(profile.userId);
  const [isUserIdEditable, setIsUserIdEditable] = useState(
    profile.userId ? false : true
  );

  useEffect(() => {
    loadMyNfts();
  }, [twitterContract, isMinting]);

  const loadMyNfts = async () => {
    const nftIds = await twitterContract?.getMyNfts();
    if (nftIds) {
      const nfts = await Promise.all(
        nftIds.map(async (nftNumber: number) => {
          const uri = await twitterContract?.tokenURI(Number(nftNumber));
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
      setIsMinting(false);
      if (!tempImg && !nftName && !userId) {
        setErrMsg("Please select an image , enter nft name and userId");
      } else if (!tempImg && !nftName) {
        setErrMsg("Please select an image , enter nft name ");
      } else if (!tempImg && !userId) {
        setErrMsg("Please select an image , enter userId");
      } else if (!nftName && !userId) {
        setErrMsg("Please enter nft name and userId");
      } else if (!tempImg) {
        setErrMsg("Please select an image");
      } else if (!nftName) {
        setErrMsg("Please enter nft name");
      } else if (!userId) {
        setErrMsg("Please enter userId");
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
      let nextNftId = Number(await twitterContract?.nextTokenIdToMint());

      const jsonRes = await axiosAPI
        .post(
          "/uploadJsonToIpfs",
          JSON.stringify({
            avatar: `${PINATA_GATEWAY_URL}/${imgUploadRes.IpfsHash}`,
            nftName,
            userId,
            nftId: nextNftId,
          })
        )
        .then((res) => res.data);
      let tokenUri = `${PINATA_GATEWAY_URL}/${jsonRes.IpfsHash}`;
      await (await twitterContract?.mintTo(tokenUri)).wait();
      await twitterContract?.setProfile(tokenUri, nextNftId);
    } catch (error) {
      console.log(error);
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
    event.stopPropagation();
    dispatch(setIsSettingProfile(true));
    try {
      const tokenURI = await twitterContract?.tokenURI(nft.nftId);
      (await twitterContract?.setProfile(tokenURI, nft.nftId)).wait();
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
  // const getEventsData = async () => {
  //   await twitterContract
  //     ?.queryFilter("TransferNft", 0, "latest")
  //     .then((events) => {
  //       console.log({ events });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  // getEventsData();

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
            {errMsg && <p className=" text-red-500">{errMsg}</p>}
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
              src={profile?.avatar}
              alt="Mint an NFT"
            ></img>
          )}
        </div>

        {imageUrl && (
          <img
            alt="profile"
            className=" h-80 w-80 align-middle "
            src={imageUrl}
          ></img>
        )}
      </div>
      <div className=" flex flex-col border-2 py-3 ">
        <h1 className=" text-center "> Owned NFTS</h1>
        <section className=" grid grid-cols-3 gap-3 ">
          {/* NFT cards */}
          {myNfts.length > 0 ? (
            myNfts.map((nft, i) => {
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
                    <img className=" h-40 w-40" src={nft.avatar} />
                    <p className=" py-2">
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
            <p className=" text-center w-full">Nothing</p>
          )}
        </section>
      </div>
      <Link href="/marketplace">
        <div className=" bg-yellow-300 p-3 rounded-xl w-fit cursor-pointer dark:text-black">
          {" "}
          Go to MarketPlace{" "}
        </div>
      </Link>
    </div>
  );
}

export default NftProfile;
