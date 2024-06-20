import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { ethers } from "ethers";

function useUniqueAddresses() {
  const { twitterContract } = useSelector(
    (state: RootState) => state.blockchain
  );
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueAddresses, setUniqueAddresses] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await twitterContract
        ?.queryFilter("TransferNft", 0, "latest")
        .then((events) => {
          events.map((event) => {
            let paddedAddress = event.topics[2];
            const address = ethers
              .getAddress(paddedAddress.slice(26))
              .toLowerCase();
            setUniqueAddresses((prev) => {
              if (!prev.includes(address)) {
                return [...prev, address];
              } else {
                return prev;
              }
            });
          });
        });
      setIsLoading(false);
    })();
  }, []);

  return { uniqueAddresses, isLoading };
}

export default useUniqueAddresses;
