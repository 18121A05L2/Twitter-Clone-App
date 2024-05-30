import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

type initialStateType = {
  twitterContract: ethers.Contract | null;
  signer: ethers.Signer | null;
  provider: ethers.Provider | null;
  walletAddress: String;
  nftContract: ethers.Contract | null;
  profile: tokenUriType;
  isSettingProfile: boolean;
  currentNftView: Object;
};

const initialState: initialStateType = {
  twitterContract: null,
  signer: null,
  provider: null,
  walletAddress: "",
  nftContract: null,
  profile: { userId: "", avatar: "", nftName: "" },
  isSettingProfile: false,
  currentNftView: {},
};

const blockchainSlice = createSlice({
  name: "blockchain",
  initialState,
  reducers: {
    setTwitterContract: (state, action) => {
      state.twitterContract = action.payload;
    },
    setSigner: (state, action) => {
      state.signer = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setNftContract: (state, action) => {
      state.nftContract = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setIsSettingProfile: (state, action) => {
      state.isSettingProfile = action.payload;
    },
    setCurrentNftView: (state, action) => {
      state.currentNftView = action.payload;
    },
  },
});

export const {
  setTwitterContract,
  setSigner,
  setProvider,
  setWalletAddress,
  setNftContract,
  setProfile,
  setIsSettingProfile,
  setCurrentNftView,
} = blockchainSlice.actions;

export default blockchainSlice.reducer;
