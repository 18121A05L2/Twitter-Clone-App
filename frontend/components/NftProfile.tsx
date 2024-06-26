import React, { useEffect, useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { useDispatch, useSelector } from "react-redux";
import "dotenv/config";
import { RootState } from "../Redux/app/store";

import axiosAPI from "../axios";
import {
  setCurrentNftView,
  setIsSettingProfile,
  setProfile,
} from "../Redux/features/BlockchainSlice";
import Link from "next/link";
import { toast } from "react-toastify";
import { PINATA_GATEWAY_URL } from "../constants/frontend";
import { tokenUriType } from "../Types/blockchain.types";

function NftProfile() {
  const [avatar, setAvatar] = useState("");
  const [nftName, setNftName] = useState("");
  const [userId, setUserId] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [tempImg, setTempImg] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [myNfts, setMyNfts] = useState<tokenUriType[]>();
  const dispatch = useDispatch();
  const { walletAddress, nftContract, profile, isSettingProfile } = useSelector(
    (state: RootState) => state.blockchain
  );
  // const nftContract = useSelector(
  //   (state: RootState) => state.blockchain.nftContract
  // );
  // const profile = useSelector((state: RootState) => state.blockchain.profile);

  useEffect(() => {
    loadMyNfts();
  }, [nftContract, isMinting]);

  useEffect(() => {
    (async () => {
      // const nftUri = await nftContract?.getProfile(walletAddress);
      // const profileRes = await fetch(nftUri).then((res) => res.json());
      // setProfile(profileRes);
    })();
  }, [nftContract]);

  const loadMyNfts = async () => {
    const nftIds = await nftContract?.getMyNfts();
    if (nftIds) {
      const nfts = await Promise.all(
        nftIds.map(async (i: number) => {
          const uri = await nftContract?.tokenURI(Number(i));
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

      // console.log({ tempImg, nftName });
      // console.log(" add avatar and name ")
      return;
    }
    setIsMinting(true);
    try {
      const formData = new FormData();
      formData.append("image", tempImg);
      const imgUploadRes = await axios
        .post("http://localhost:8001/uploadImageToIpfs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
      setAvatar(`${PINATA_GATEWAY_URL}/${imgUploadRes.IpfsHash}`);
      let nftId = Number(await nftContract?.nextTokenIdToMint());

      const jsonRes = await axiosAPI
        .post(
          "/uploadJsonToIpfs",
          JSON.stringify({
            avatar: `${PINATA_GATEWAY_URL}/${imgUploadRes.IpfsHash}`,
            nftName,
            userId,
            nftId,
          })
        )
        .then((res) => res.data);
      let tokenUri = `${PINATA_GATEWAY_URL}/${jsonRes.IpfsHash}`;
      await (await nftContract?.mintTo(tokenUri)).wait();
      // await nftContract?.setProfile(tokenIdCount);
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

  const switchProfile = async (event: any, nft: tokenUriType) => {
    event.stopPropagation();
    dispatch(setIsSettingProfile(true));
    try {
      (await nftContract?.setProfile(nft.nftId)).wait();
      const nftUri = await nftContract?.getProfile(walletAddress);
      const profileRes = await fetch(nftUri).then((res) => res.json());
      dispatch(setProfile(profileRes));
      dispatch(setIsSettingProfile(false));
    } catch (err : any) {
      toast(err.shortMessage, { type: "error" });
    }
  };
  const getEventsData = async () => {
    await nftContract
      ?.queryFilter("Transfer", 0, "latest")
      .then((events) => {
        console.log({ events });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getEventsData();

  // nftContract
  //   ?.on("Transfer", (event) => {
  //     console.log(" received " + event);
  //   })
  //   .then((events) => {
  //     console.log(" event in real time ");
  //     console.log(events);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // console.log(profile);

  const nftOnclick = async (nft: tokenUriType) => {
    dispatch(setCurrentNftView(nft));
  };

  return (
    <div className=" no-scrollbar no-scrollbar flex max-h-screen flex-col gap-5 overflow-y-scroll">
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
              className=" rounded-md border-2 p-1 outline-none  "
              type="text"
              placeholder="NFT name "
              onChange={(e) => setNftName(e.target.value)}
            ></input>
            <input
              className=" rounded-md border-2 p-1 outline-none  "
              type="text"
              placeholder="user id "
              onChange={(e) => setUserId(e.target.value)}
            ></input>
            <div
              onClick={MintNft}
              className=" max-w-40  cursor-pointer rounded-md bg-blue-200 px-4 "
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
              className=" ml-auto mr-auto h-24 w-24 self-center rounded-full border-2 border-blue-500  "
              src={profile?.avatar}
              alt={profile?.nftName}
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
          {myNfts?.map((nft, i) => {
            return (
              <Link className=" cursor-pointer " passHref href={`/nft`}>
                <div
                  key={i}
                  className=" flex cursor-pointer flex-col  items-center rounded-lg  "
                  onClick={() => nftOnclick(nft)}
                >
                  <img className=" h-40 w-40" src={nft.avatar} />
                  <p>
                    {" "}
                    {nft.nftId && `#${nft.nftId} - `} {nft.nftName}
                  </p>
                  <div
                    onClick={(event) => switchProfile(event, nft)}
                    className=" cursor-pointer rounded-lg bg-slate-500 px-2"
                  >
                    Set as NFT profile
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
      <div className=""> Go to MarketPlace </div>
    </div>
  );
}

export default NftProfile;
