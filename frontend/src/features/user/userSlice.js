import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const userData = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userData || null,
  token: localStorage.getItem("token") || null,
  currentPage: 1,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
};

// Thunk: User Registration
export const register = createAsyncThunk(
  "user/register",
  async (formData, thunkAPI) => {
    try {
      const response = await api.post(`/users/register`, formData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk: User Login
export const login = createAsyncThunk(
  "user/login",
  async (formData, thunkAPI) => {
    try {
      const response = await api.post(`/users/login`, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk: User Logout
export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return "Logged out successfully";
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to log out");
  }
});

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Login Cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Logout Cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isSuccess = true;
        state.message = "Logged out successfully";
      })
      .addCase(logout.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetState } = userSlice.actions;
export const userReducer = userSlice.reducer;
