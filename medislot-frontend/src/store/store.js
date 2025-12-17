import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../api/authentication/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
