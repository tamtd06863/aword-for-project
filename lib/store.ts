import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/lib/features/auth/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  // [aclApi.reducerPath]: aclApi.reducer,
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
