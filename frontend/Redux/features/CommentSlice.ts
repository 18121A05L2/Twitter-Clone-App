import { createSlice } from "@reduxjs/toolkit";

type initialState = {
  modalState: boolean;
  post: {
    createdAt: string;
    userEmail: string;
    userId: string;
    userImage: string;
    userName: string;
    userInput: string;
  };
};

const initialState: initialState = {
  modalState: false,
  post: {
    createdAt: new Date().toISOString(),
    userEmail: "",
    userId: "",
    userImage: "",
    userName: "",
    userInput: "",
  },
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    modalStateChainging: (state) => {
      state.modalState = !state.modalState;
    },
    tweetContent: (state, action) => {
      state.post = action.payload;
      console.log("😎" + action.payload);
      for (const tweet in action.payload) {
        console.log(tweet + "🥶");
      }
    },
  },
});

export default commentSlice.reducer;
export const { modalStateChainging, tweetContent } = commentSlice.actions;
