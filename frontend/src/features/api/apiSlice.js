import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../index";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        headers.set("authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Farmer", "Farmland", "Division", "Monitoring"],
  endpoints: (build) => ({
    addFarmer: build.mutation({
      query: (body) => {
        return {
          url: `/farmers`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Farmer"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),
    addFarmland: build.mutation({
      query: (body) => {
        return {
          url: `/farmlands?farmerId=${body.farmerId}`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Farmland"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),
    getFarmersBy: build.query({
      query: (filterBy) => `/farmers?from=${filterBy}`,
      providesTags: ["Farmer"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),
    getFarmlandsBy: build.query({
      query: (filterBy) => `/farmlands?from=${filterBy}`,
      providesTags: ["Farmland"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),

    addCoordinates: build.mutation({
      query: ({ geocoordinates, farmlandId }) => {
        const body = {
          geocoordinates: {
            latitude: geocoordinates.latitude,
            longitude: geocoordinates.longitude,
          },
        };
        return {
          url: `/farmlands/${farmlandId}`,
          method: "PATCH",
          body: body,
        };
      },
      invalidatesTags: ["Division"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),

    addDivision: build.mutation({
      query: (body) => {
        return {
          url: `/farmlands/${body.farmlandId}/divisions`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Division"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),
    getPerformance: build.query({
      query: (currentUser) =>
        `/performances?userId=${currentUser?._id}&district=${currentUser?.address?.district}&province=${currentUser?.address?.province}`,
      providesTags: ["Farmer", "Farmland", "Division", "Weeding", "Monitoring"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),

    addMonitoringReport: build.mutation({
      query: (body) => {
        return {
          url: `/monitorings/${body.flag}`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Monitoring"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),

    getMonitoringReportsByDivisionId: build.query({
      query: (division) => {
        const id = division ? division?._id : "void";
        return {
          url: `/monitorings/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Monitoring"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),

    getAllMonitoringReports: build.query({
      query: () => {
        return {
          url: `/monitorings`,
          method: "GET",
        };
      },
      providesTags: ["Monitoring"],
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          requestId,
          extra,
          getCacheEntry,
          cacheDataLoaded,
          cacheEntryRemoved,
        }
      ) {},
    }),
  }),
});

export const { 

    // farmer
    useAddFarmerMutation,
    useGetFarmersByQuery,

    // farmland
    useAddFarmlandMutation,
    useAddDivisionMutation,
    useGetFarmlandsByQuery,
    useAddCoordinatesMutation,

    // performance
    useGetPerformanceQuery,

    // monitoring
    useAddMonitoringReportMutation,
    useGetMonitoringReportsByDivisionIdQuery,

} = apiSlice;
