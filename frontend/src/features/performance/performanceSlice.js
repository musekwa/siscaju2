
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { baseURL } from "..";


// // const baseURL = `http://localhost:8080/performances` 

// let user = JSON.parse(localStorage.getItem("user"));

// export const performancesApi = createApi({
//     reducerPath: "performancesApi",
//     keepUnusedDataFor: 0,
//     baseQuery: fetchBaseQuery({ 
//         baseUrl: baseURL,
//         prepareHeaders: (headers, { getState })=>{
//             if (user) {
//                 headers.set('authorization', `Bearer ${user.token}`)
//             }
//             return headers;
//         },
//     }),
//     refetchOnMountOrArgChange: 1,
//     endpoints: (builder)=>({
//         getPerformances: builder.query({
//             query: ()=> `/performances?userId=${user?._id}&district=${user?.address?.district}&province=${user?.address?.province}`
//         }),
//     }),
// })

// export const { useGetPerformancesQuery } = performancesApi;