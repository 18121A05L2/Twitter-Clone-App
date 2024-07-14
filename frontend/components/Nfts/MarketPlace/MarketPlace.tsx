import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/app/store";
import axiosAPI from "../../../axios";
import { listedNftType, nftPostType } from "../../../Types/blockchain.types";
import Link from "next/link";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { all } from "axios";
import NormalNft from "./NormalNft";
import ListedNft from "./ListedNft";
import { zeroAddress } from "../../../utils/constants";

function MarketPlace() {
  const [allNfts, setAllNfts] = useState<nftPostType[]>([]);
  const [listedNfts, setListedNfts] = useState<listedNftType[]>([]);
  const [listedNftsChanged, setListedNftsChanged] = useState(false);
  const { twitterContract, nftContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );

  useEffect(() => {
    (async () => {
      const noOfNftsMinted = Number(await nftContract?.nextTokenIdToMint());
      // console.log("noOfNftsMinted : ", noOfNftsMinted - 1);
      let nfts = await Promise.all(
        [...Array(noOfNftsMinted).keys()]
          .slice(1)
          .map(async (nftNumber: number) => {
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
      nfts = nfts.filter((nft) => nft);
      setAllNfts(nfts);
    })();
  }, [twitterContract]);

  useEffect(() => {
    (async () => {
      const listedNfts: listedNftType[] = (await nftContract
        ?.queryFilter("NFTListed", 0, "latest")
        .then((events) => {
          const listedNfts = events
            .map((event: any) => {
              const [tokenId, sender, price] = event.args;
              return { nftId: Number(tokenId), sender, price: Number(price) };
            })
            .filter(async (nft) => await nftContract?.ownerOf(nft.nftId));
          // console.log({ listedNfts });
          return listedNfts;
        })) as listedNftType[];
      const filterPromises: Promise<listedNftType>[] = listedNfts?.map(
        async (listedNft) => {
          const listedNftStruct = await nftContract?.getListedNFT(
            listedNft.nftId
          );
          const [address, nftId, sold] = listedNftStruct;
          // console.log({ listedNftStruct, listedNft, address });
          console.log(address.toLowerCase() !== zeroAddress.toLowerCase());
          return {
            ...listedNft,
            notListed: address.toLowerCase() !== zeroAddress.toLowerCase(),
          };
        }
      );
      const filterResults = await Promise.all(filterPromises);
      const filteredListedNfts = filterResults.filter(
        (filterNft) => filterNft?.notListed
      );
      console.log({ filteredListedNfts, listedNfts });
      filteredListedNfts && setListedNfts(filteredListedNfts);
    })();
  }, [twitterContract, listedNftsChanged]);

  function handleListedNftsChanged() {
    setListedNftsChanged(!listedNftsChanged);
  }

  return (
    <>
      {allNfts.length == 0 ? (
        <div className=" w-full flex justify-center h-1/2 items-center ">
          <AiTwotoneThunderbolt className=" w-24 h-24 animate-bounce " />
        </div>
      ) : (
        <div className="flex flex-col gap-3 ">
          {/* Listed Nfts */}
          <div className=" border-2 flex flex-col items-center ">
            <h1 className=" font-bold text-2xl border-b-[0.1rem] w-full text-center ">
              Listed Nfts
            </h1>
            {listedNfts.length == 0 && (
              <div className="  flex justify-center items-center">None</div>
            )}
            <section className="grid grid-cols-3 gap-3 min-h-[200px] ">
              {listedNfts.length > 0 &&
                listedNfts.map((listedNft, i) => (
                  <ListedNft
                    listedNft={listedNft}
                    key={i}
                    handleListedNftsChanged={handleListedNftsChanged}
                  />
                ))}
            </section>
          </div>

          <h1 className=" font-bold text-2xl  w-full text-center ">All Nfts</h1>
          <section className=" grid grid-cols-3 gap-3 ">
            {allNfts.length > 0 &&
              allNfts.map((nft, i) => {
                return (
                  <NormalNft
                    nft={nft}
                    key={i}
                    listedNfts={listedNfts}
                    handleListedNftsChanged={handleListedNftsChanged}
                  />
                );
              })}
          </section>
        </div>
      )}
    </>
  );
}

export default MarketPlace;
