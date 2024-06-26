import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/app/store";
import axiosAPI from "../../../axios";
import { nftPostType } from "../../../Types/blockchain.types";
import Link from "next/link";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { all } from "axios";
import NormalNft from "./NormalNft";
import ListedNft from "./ListedNft";

function MarketPlace() {
  const [allNfts, setAllNfts] = useState<nftPostType[]>([]);
  const [listedNfts, setListedNfts] = useState([]);
  const { twitterContract, nftContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  console.log({ listedNfts });

  useEffect(() => {
    (async () => {
      const noOfNftsMinted = Number(await nftContract?.nextTokenIdToMint());
      console.log({ noOfNftsMinted });
      const nfts = await Promise.all(
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
      setAllNfts(nfts);
    })();
  }, [twitterContract]);

  useEffect(() => {
    (async () => {
      const listedNfts = await nftContract
        ?.queryFilter("NFTListed", 0, "latest")
        .then((events) => {
          const listedNfts = events.map((event) => {
            const [tokenId, sender, price] = event.args;
            return { tokenId: Number(tokenId), sender, price: Number(price) };
          });
          return listedNfts;
        });
      setListedNfts(listedNfts);
    })();
  }, [twitterContract]);

  return (
    <>
      {allNfts.length == 0 ? (
        <div className=" w-full flex justify-center h-1/2 items-center ">
          <AiTwotoneThunderbolt className=" w-24 h-24 animate-bounce " />
        </div>
      ) : (
        <div>
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
                listedNfts.map((nft, i) => <ListedNft nft={nft} />)}
            </section>
          </div>

          <section className=" grid grid-cols-3 gap-3 ">
            {allNfts.length > 0 &&
              allNfts.map((nft, i) => {
                return <NormalNft nft={nft} key={i} />;
              })}
          </section>
        </div>
      )}
    </>
  );
}

export default MarketPlace;
