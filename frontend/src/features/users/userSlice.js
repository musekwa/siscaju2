import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { baseURL } from "..";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const register = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) =>{
        try {
            const response = await axios.post(baseURL + "/register", user);
            if(response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
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

export const login = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(baseURL + "/login", user);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
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

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: (state)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        resetUser: (state) =>{
            state.user = null;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(register.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action)=>{
                state.isError = true;
                state.isLoading = false;
                state.user = null;
                state.message = action.message;
            })
            .addCase(login.pending, (state)=>{
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action)=>{
                state.isError = true;
                state.isLoading = false;
                state.user = null;
                state.message = action.message;
            })
    }
});

export const { reset, resetUser } = userSlice.actions;
export default userSlice.reducer;


