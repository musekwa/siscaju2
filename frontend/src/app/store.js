
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import authReducer from '../features/auth/authSlice'
import goalReducer from "../features/goals/goalSlice";
import farmerReducer from '../features/farmers/farmerSlice'
import farmlandReducer from "../features/farmlands/farmlandSlice";
import farmlandDivisionReducer from '../features/farmlandDivisions/farmlandDivisionSlice'

import { farmlandsApi } from "../features/farmlands/farmlandSlice";
import { farmersApi } from '../features/farmers/farmerSlice';
import { performancesApi } from '../features/performance/performanceSlice';
import userReducer from '../features/users/userSlice';
import { apiSlice } from '../features/api/apiSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,

  },

  middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
                                            .concat(apiSlice.middleware),

});

setupListeners(store.dispatch)