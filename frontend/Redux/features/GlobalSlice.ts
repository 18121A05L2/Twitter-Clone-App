import { createSlice } from "@reduxjs/toolkit";
import { nftPostType } from "../../Types/blockchain.types";

type initialState = {
  tweetAdded: number;
  commentAdded: number;
  dataChanged: number;
  profileDataChanged: number;
  chatUpdate: number;
  tweetBoxModalState: boolean;
  editProfileModalState: boolean;
  onlineUsers: [];
  isDarkMode: boolean;
  receiverProfile: nftPostType;
};

const initialState: initialState = {
  tweetAdded: 0,
  commentAdded: 0,
  dataChanged: 0,
  profileDataChanged: 0,
  chatUpdate: 0,
  tweetBoxModalState: false,
  editProfileModalState: false,
  onlineUsers: [],
  isDarkMode: false,
  receiverProfile: { userId: "", avatar: "", nftName: "" },
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    tweetAdded: (state) => {
      state.tweetAdded += 1;
    },
    commentAdded: (state) => {
      state.commentAdded += 1;
    },
    tweetBoxModal: (state) => {
      state.tweetBoxModalState = !state.tweetBoxModalState;
    },
    editProfileModal: (state) => {
      state.editProfileModalState = !state.editProfileModalState;
    },

    clicked: (state) => {
      state.dataChanged += 1;
    },
    profileDataChainging: (state) => {
      state.profileDataChanged += 1;
    },
    updatingChat: (state) => {
      state.commentAdded += 1;
    },
    settingOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setReceiverProfile: (state, action) => {
      state.receiverProfile = action.payload;
    },
  },
});

export const {
  tweetAdded,
  commentAdded,
  tweetBoxModal,
  clicked,
  editProfileModal,
  profileDataChainging,
  updatingChat,
  settingOnlineUsers,
  toggleDarkMode,
  setReceiverProfile,
} = globalSlice.actions;
export default globalSlice.reducer;
