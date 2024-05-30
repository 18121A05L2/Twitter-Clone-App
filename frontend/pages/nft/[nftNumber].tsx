import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";

function SpecificNft() {
  const router = useRouter();
  const { nftContract } = useSelector((state: RootState) => state.blockchain);
  const nftId = Number(router.query.nftNumber);

  useEffect(() => {
    (async () => {
      const nftUrl = await nftContract?.tokenURI(nftId);
      console.log(nftContract);
      console.log(nftUrl);
    })();
  }, [nftContract]);
  return <div>SpecificNft</div>;
}

export default SpecificNft;
