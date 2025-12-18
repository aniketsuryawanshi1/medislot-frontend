import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../api/authentication/authSlice";
import doctorReducer from "../api/doctor/doctorSlice";
import patientReducer from "../api/patient/patientSlice";
import telegramReducer from "../api/telegram/telegramSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    patient: patientReducer,
    telegram: telegramReducer,
  },
});

export default store;
