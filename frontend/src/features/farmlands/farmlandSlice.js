// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApi, fetchBaseQuery  } from "@reduxjs/toolkit/dist/query/react";
// import farmlandService from "./farmlandService";


// const baseURL = `http://localhost:8080/farmlands`

// // get user from localsStorage
// // const user = JSON.parse(localStorage.getItem("user"));

// const initialState = {
//   farmland: null,
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
// };

// let user = JSON.parse(localStorage.getItem("user"));

// //get farmlands
// export const farmlandsApi = createApi({
//   reducerPath: "farmlandsApi",
//   keepUnusedDataFor: 0,
//   baseQuery: fetchBaseQuery({
//     baseUrl: baseURL,
//     prepareHeaders: (headers, { getState }) => {
//       if (user) {
//         headers.set("authorization", `Bearer ${user.token}`);
//       }
//       return headers;
//     },
//   }),
//   refetchOnMountOrArgChange: 1,
//   endpoints: (builder) => ({
//     getFarmlands: builder.query({
//       query: () => `/`,
//     }),
//     getFarmlandsByDistrict: builder.query({
//       query: (district) => `?district=${district}`,
//     }),
//     getFarmlandsBy: builder.query({
//       query: (filterBy) => `?from=${filterBy}`,
//     }),
//   }),
// });

// export const { useGetFarmlandsQuery, useGetFarmlandsByDistrictQuery, useGetFarmlandsByQuery } = farmlandsApi;



// // register a farmland
// export const farmlandRegister = createAsyncThunk(
//   "farmland/register",
//   async (farmland, thunkAPI) => {
//     try {
//       return await farmlandService.farmlandRegister(farmland);
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

// export const farmlandSlice = createSlice({
//   name: "farmland",
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
//       .addCase(farmlandRegister.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(farmlandRegister.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.farmland = action.payload;
//       })
//       .addCase(farmlandRegister.rejected, (state, action) => {
//         state.isError = true;
//         state.isLoading = false;
//         state.farmland = null;
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

// export const { reset } = farmlandSlice.actions;
// export default farmlandSlice.reducer;
