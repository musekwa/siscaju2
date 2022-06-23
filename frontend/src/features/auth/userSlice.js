// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { baseURL } from "..";
// import axios from 'axios';


// const API_URL = "http://localhost:8080/users";
// const LOGIN_URL = "http://localhost:8080/login";

// export const usersApi = createApi({
//   reducerPath: "usersApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: baseURL,
//   }),
//   tagTypes: ["User"],
//   endpoints: (builder) => ({
//     users: builder.query({
//       query: () => baseURL + "/users",
//     }),
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: baseURL + "/login",
//         method: "POST",
//         body: credentials,
//       }),
//       transformResponse: (response, meta, arg) => response.data,
//       invalidatesTags: ["User"],
//       async onQueryStarted(
//         arg,
//         { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
//       ) {},

//       async onCacheEntryAdded(
//         arg,
//         { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
//       ) {},
//     }),
//     register: builder.mutation({
//       query: (userData) => ({
//         url: baseURL + "/register",
//         method: "POST",
//         body: userData,
//       }),
//       transformResponse: (response, meta, arg) => {
//         if (response.data) {
//             localStorage.setItem("user", JSON.stringify(response.data));
//         }
//         return response;
//       },
//       invalidatesTags: ["User"],

//       async onQueryStarted(
//         arg,
//         { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
//       ) {},

//       async onCacheEntryAdded(
//         arg,
//         { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
//       ) {},
//     }),
//     userById: builder.query({
//       query: (userId) => baseURL + `/users/${userId}`,
//     }),
//   }),
// });

// export const {
//     useUsersQuery, useLoginMutation, useRegisterMutation, useUserByIdQuery
// } = usersApi;