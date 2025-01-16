import tempContractAddresses from "./Blockchain/foundry/contractAddresses.json";
import TwitterAbi from "./Blockchain/foundry/TwitterAbi.json";
import TwitterNftsAbi from "./Blockchain/foundry/TwitterNftsAbi.json";
// import { ContractAddresses } from "../contractAddresses";

type ContractAddresses = {
  [chainId: string]: {
    Twitter: string;
    TwitterProxy: string;
    TwitterV2: string;
    TwitterNfts: string;
  };
};

const chaninId = process.env.CHAIN_ID || "31337";

const chainSpecificAddresses: ContractAddresses = tempContractAddresses;

export { chainSpecificAddresses, TwitterAbi, TwitterNftsAbi };
