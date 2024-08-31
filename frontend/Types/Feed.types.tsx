type commentType = {
  postId: string;
  replyData: string;
  avatar: string;
  userId: string;
  tweetUserId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
};

type likeType = {
  userId: string;
};
// postType of tweetType refers to same if defined anywhere

type postType = {
  _id?: string;
  userId: string;
  avatar: string;
  userInput: string;
  comments?: [commentType];
  likes?: [likeType];
  retweets?: [];
  timeStamp: Date;
  ipfsHash?: string;
  address: string;
};

type profileType = {
  // _id?: string;
  backgroundImage?: string;
  userId: string;
  avatar: string;
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  birthDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  nftName?: string;
  address: string;
  nftId?: number;
};

type messageType = {
  _id?: string;
  senderAddress: string;
  receiverAddress: string;
  msg: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type conversationType = {
  conversationId: string;
  messages: [messageType];
};

export type {
  postType,
  profileType,
  conversationType,
  commentType,
  messageType,
};
