declare module "./constants/contractAddresses.json" {
  interface ContractAddress {
    Twitter: string;
    TwitterNfts: string;
  }

  interface ContractAddresses {
    [key: string]: ContractAddress;
  }

  const value: ContractAddresses;
  export default value;
}
