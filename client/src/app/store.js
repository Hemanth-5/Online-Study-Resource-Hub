// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // Use sessionStorage
import userReducer from "../features/userSlice";
import resourceReducer from "../features/resourceSlice";

const persistConfig = {
  key: "root", // Key for the persisted storage in sessionStorage
  storage: storageSession, // Using sessionStorage instead of localStorage
  whitelist: ["resource", "tag", "user"], // Persist only resource slice
};

const rootReducer = combineReducers({
  user: userReducer,
  resource: resourceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
