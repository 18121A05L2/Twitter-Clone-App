export type nftPostType = {
  userId: string;
  avatar: string;
  nftName: string;
  address: string;
  nftId: number;
};

export type transactionData = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
};

export type listedNftType = {
  nftId: number;
  sender: string;
  price: number;
  notListed?: boolean;
};
