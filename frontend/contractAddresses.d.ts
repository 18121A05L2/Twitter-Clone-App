declare module "./constants/contractAddresses.json" {
  interface ContractAddress {
    Twitter: string;
    TwitterNfts?: string;
    TwitterProxy;
    string;
    TwitterV2: string;
  }

  interface ContractAddresses {
    [key: string]: ContractAddress;
  }

  const value: ContractAddresses;
  export default value;
}

interface ContractAddress {
  Twitter: string;
  TwitterNfts?: string;
  TwitterProxy;
  string;
  TwitterV2: string;
}

interface ContractAddresses {
  [key: string]: ContractAddress;
}

export { ContractAddresses };
