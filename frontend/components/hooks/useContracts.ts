import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  contractAddresses,
  TwitterAbi,
  TwitterNftsAbi,
} from "../../constants/exportJsons";
import {
  setNftContract,
  setProfile,
  setProvider,
  setSigner,
  setTwitterContract,
} from "../../Redux/features/BlockchainSlice";
import { toast } from "react-toastify";

const useContracts = () => {
  const dispatch = useDispatch();
  let nftContract, twitterContract;
  const [isContractsLoading, setIsContractsLoading] = useState(true);

  const { walletAddress } = useSelector((state: RootState) => state.blockchain);

  useEffect(() => {
    (async function () {
      try {
        if (typeof window.ethereum !== "undefined" && walletAddress) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const networkConfig = await provider.getNetwork();
          const signer = await provider.getSigner();
          const chainId = networkConfig.chainId;
          dispatch(setProvider(provider));
          dispatch(setSigner(signer));
          //TODO: need to modify this
          // Twitter contract implementation
          let twitterContractAddress =
            contractAddresses[Number(chainId)].Twitter;
          let twitterContract = new ethers.Contract(
            twitterContractAddress,
            TwitterAbi,
            signer
          );
          dispatch(setTwitterContract(twitterContract));

          // NFT contract implementation
          let nftContractAddress =
            contractAddresses[chainId.toString()].TwitterNfts;
          let nftContract = new ethers.Contract(
            nftContractAddress,
            TwitterNftsAbi,
            signer
          );
          dispatch(setNftContract(nftContract));

          // setting the profile if user already exists
          const nftUri = await nftContract?.getProfile(walletAddress);
          const profileRes = await fetch(nftUri).then((res) => res.json());
          dispatch(setProfile(profileRes));
        } else {
          // console.log("connect wallet ");
        }
      } catch (err) {
        console.log({ err });
        toast("Contracts : " + err.shortMessage, { type: "error" });
      } finally {
        setIsContractsLoading(false);
      }
    })();
  }, [walletAddress]);

  return {
    twitterContract,
    nftContract,
    isContractsLoading,
  };
};

export default useContracts;
