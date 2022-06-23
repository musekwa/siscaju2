// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import farmlandDivisionService from "./farmlandDivisionService";
// import { baseURL } from "..";

// // get user from localsStorage
// // const user = JSON.parse(localStorage.getItem("user"));

// const initialState = {
//   farmlandDivision: null,
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
// };

// // register a farmland
// export const farmlandDivisionRegister = createAsyncThunk(
//   "farmlandDivision/register",
//   async (farmlandDivision, thunkAPI) => {
//     try {
//       return await farmlandDivisionService.farmlandDivisionRegister(farmlandDivision);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
// //   try {
// //     return await authService.login(user);
// //   } catch (error) {
// //     const message =
// //       (error.response && error.response.data && error.response.data.message) ||
// //       error.message ||
// //       error.toString();
// //     return thunkAPI.rejectWithValue(message);
// //   }
// // });

// // export const logout = createAsyncThunk("auth/logout", async () => {
// //   await authService.logout();
// // });

// export const farmlandDivisionSlice = createSlice({
//   name: "farmlandDivision",
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.isLoading = false;
//       state.isError = false;
//       state.isSuccess = false;
//       state.message = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(farmlandDivisionRegister.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(farmlandDivisionRegister.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.farmlandDivision = action.payload;
//       })
//       .addCase(farmlandDivisionRegister.rejected, (state, action) => {
//         state.isError = true;
//         state.isLoading = false;
//         state.farmlandDivision = null;
//         state.message = action.payload;
//       });
//     //   .addCase(login.pending, (state) => {
//     //     state.isLoading = true;
//     //   })
//     //   .addCase(login.fulfilled, (state, action) => {
//     //     state.isLoading = false;
//     //     state.isSuccess = true;
//     //     state.user = action.payload;
//     //   })
//     //   .addCase(login.rejected, (state, action) => {
//     //     state.isLoading = false;
//     //     state.isError = true;
//     //     state.message = action.payload;
//     //     state.user = null;
//     //   })
//     //   .addCase(logout.fulfilled, (state) => {
//     //     state.user = null;
//     //   });
//   },
// });

// export const { reset } = farmlandDivisionSlice.actions;
// export default farmlandDivisionSlice.reducer;
