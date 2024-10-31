import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../features/user/userSlice";
import { ticketReducer } from "../features/ticket/ticketSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    ticket: ticketReducer,
  },
});

export default store;
