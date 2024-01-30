import { configureStore, combineReducers } from "@reduxjs/toolkit"
import userReducer from "./user/userSlice.js"
import themeReducer from "./theme/themeSlice.js"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
})
const persistConfig = {
  key: "root",
  storage,
  version: 1,
}

const persistantReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistantReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store)
