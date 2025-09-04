import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import boardReducer from "./slices/boardSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "boards"],
  version: 1,
  debug: process.env.NODE_ENV === "development",
};

const rootReducer = combineReducers({
  user: userReducer,
  boards: boardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [
          "user.currentUser.createdAt", 
          "user.currentUser.lastActive",
          "user.currentUser.updatedAt",
          "boards.currentBoard.createdAt",
          "boards.currentBoard.updatedAt",
          "boards.boards[].createdAt",
          "boards.boards[].updatedAt"
        ],
      },
    }),
});

// Создаем persistor
export const persistor = persistStore(store);

// Подписываемся на изменения store для логирования
let previousBoardsCount = 0;
store.subscribe(() => {
  const state = store.getState();
  const currentBoardsCount = state.boards.boards.length;
  
  // Логируем только изменения количества досок
  if (currentBoardsCount !== previousBoardsCount) {
    previousBoardsCount = currentBoardsCount;
  }
});

// Восстанавливаем состояние из localStorage
persistor.persist();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;