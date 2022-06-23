// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// import { baseURL } from "..";
// import farmerService from "./farmerService";


// // const baseURL = `http://localhost:8080/farmers`


// // get user from localsStorage
// // const user = JSON.parse(localStorage.getItem("user"));

// const initialState = {
//   farmer: null,
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
// };

// let user = JSON.parse(localStorage.getItem("user"));

// export const farmersApi = createApi({
//   reducerPath: "farmersApi",
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
//     getFarmers: builder.query({
//       query: () => baseURL + `/farmers`,
//     }),
//     getFarmerById: builder.query({
//       query: (farmerId)=> baseURL + `farmers/${farmerId}`
//     }),
//     getFarmersByDistrict: builder.query({
//       query: (district)=> baseURL + `/farmers?district=${district}`
//     }),
//     getFarmersBy: builder.query({
//       query: (filterBy)=> baseURL + `/farmers?from=${filterBy}`
//     })
//   }),
// });

// export const { useGetFarmersQuery, useGetFarmerByIdQuery, useGetFarmersByDistrictQuery , useGetFarmersByQuery } = farmersApi;










// // register farmer
// export const addFarmer = createAsyncThunk(
//   "farmer/register",
//   async (farmer, thunkAPI) => {
//     try {
//       return await farmerService.addFarmer(farmer);
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



// // get all farmers
// // export const getFarmers = createAsyncThunk(
// //   "farmers/list",
// //   async (farmer, thunkAPI) => {
// //     try {
// //       return await farmerService.getFarmers();
// //     } catch (error) {
// //       const message =
// //         (error.response &&
// //           error.response.data &&
// //           error.response.data.message) ||
// //         error.message ||
// //         error.toString();
// //       return thunkAPI.rejectWithValue(message);
// //     }
// //   }
// // );

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

// export const farmerSlice = createSlice({
//   name: "farmer",
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
//       .addCase(addFarmer.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(addFarmer.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.farmer = action.payload;
//       })
//       .addCase(addFarmer.rejected, (state, action) => {
//         state.isError = true;
//         state.isLoading = false;
//         state.farmer = null;
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

// export const { reset } = farmerSlice.actions;
// export default farmerSlice.reducer;
