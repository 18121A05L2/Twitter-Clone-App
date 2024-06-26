import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "../features/CommentSlice";
import globalReducer from "../features/GlobalSlice";
import blockchainReducer from "../features/BlockchainSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  comment: commentReducer,
  global: globalReducer,
  blockchain: blockchainReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  //TODO: recheck this ignoring noserializable data storing
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "blockchain/setProvider",
          "blockchain/setSigner",
          "blockchain/setTwitterContract",
          "blockchain/setNftContract",
        ],
        ignoredPaths: [
          "register",
          "rehydrate",
          "blockchain.provider",
          "blockchain.signer",
          "blockchain.twitterContract",
          "blockchain.nftContract",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export default store;
