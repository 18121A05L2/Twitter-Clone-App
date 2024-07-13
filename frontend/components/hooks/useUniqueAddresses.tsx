import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { ethers } from "ethers";
import { contractAddresses } from "../../utils/exportJsons";
import { sepoliaTestnetId } from "../../utils/constants";

function useUniqueAddresses() {
  const { nftContract } = useSelector((state: RootState) => state.blockchain);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueAddresses, setUniqueAddresses] = useState<string[]>([]);

  const myContractAddresses = Object.values(
    contractAddresses[sepoliaTestnetId]
  ).map((address) => address.toLowerCase());
  console.log({ myContractAddresses });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await nftContract?.queryFilter("Transfer", 0, "latest").then((events) => {
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
      setUniqueAddresses((prev) => {
        const withOutContractAddresses = prev.filter((address) => !myContractAddresses.includes(address));
        console.log({ withOutContractAddresses });
        return withOutContractAddresses;
      });
    })();
  }, []);

  return { uniqueAddresses, isLoading };
}

export default useUniqueAddresses;
