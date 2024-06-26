import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";

function SpecificNft() {
  const router = useRouter();
  const { twitterContract } = useSelector(
    (state: RootState) => state.blockchain
  );
  const nftId = Number(router.query.nftNumber);

  useEffect(() => {
    (async () => {
      const nftUrl = await twitterContract?.tokenURI(nftId);
      console.log(twitterContract);
      console.log(nftUrl);
    })();
  }, [twitterContract]);
  return <div>SpecificNft</div>;
}

export default SpecificNft;
