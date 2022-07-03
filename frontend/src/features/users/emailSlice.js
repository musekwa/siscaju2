import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "..";


const initialState = {
  email: "",
  password: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};


export const passwordReset = createAsyncThunk(
  "user/email",
  async (email, thunkAPI) => {
    try {
      const response = await axios.get(baseURL + `/user/${email}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const passwordUpdate = createAsyncThunk(
  "user/password",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(baseURL + `/user/${userData.password}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetEmail: (state) => {
      state.email = "";
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetPassword: (state)=>{
      state.password = "";
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(passwordReset.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(passwordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.email = action.payload;
      })
      .addCase(passwordReset.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.email = "";
        state.message = action.payload;
      })
      .addCase(passwordUpdate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(passwordUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.password = action.payload;
      })
      .addCase(passwordUpdate.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.password = "";
        state.message = action.payload;
      });
  },
});

export const { reset, resetEmail, resetPassword } = emailSlice.actions;
export default emailSlice.reducer;
