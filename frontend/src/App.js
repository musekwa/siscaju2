
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/users/Login";
import UserRegister from "./pages/users/UserRegister";
import FarmerRegister from "./pages/farmers/FarmerRegister";
import FarmlandRegister from "./pages/farmlands/FarmlandRegister";
// import Monitorings from "./pages/Monitorings";
import FarmersList from "./pages/farmers/FarmersList";
import FarmlandsList from "./pages/farmlands/FarmlandsList";
import NotFound from "./pages/NotFound";
import FarmlandDivisionRegister from "./pages/farmlands/FarmlandDivisionRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import FarmlandAdd from "./pages/farmlands/FarmlandAdd";
import Farmer from "./pages/farmers/Farmer";
import Farmland from "./pages/farmlands/Farmland";

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { apiSlice } from "./features/api/apiSlice";
import Spinner from "./components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import FarmlandCoordinates from "./pages/farmlands/FarmlandCoordinates";
import { resetUser } from "./features/users/userSlice"
import { toast } from "react-toastify";

const Dashboard = lazy(()=>import("./pages/dashboard/Dashboard"));


function App() {

const navigate = useNavigate()
const dispatch = useDispatch()
const { user, isLoading, isError } = useSelector((state) => state.user);

useEffect(()=>{

  // if (isError){
  //   navigate('/signin')
  //   localStorage.removeItem("user");
  //   dispatch(resetUser());
  // }

}, [user, isError, isLoading])


if (isLoading) {
  return <Spinner />
}
  

  return (
    <>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center ",
              width: "100%",
              height: "90vh",
              backgroundColor: "gray",
            }}
          >
            <Typography>Carregando...</Typography>
          </Box>
        }
      >
        <Routes>
          {/* User Routes */}
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<UserRegister />} />

          {/**  Dashboard */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farmers" element={<FarmerRegister />} />
            <Route
              path="/farmlands"
              element={<FarmlandRegister />}
            />
            <Route
              path="/divisions"
              element={<FarmlandDivisionRegister user={user} />}
            />
            <Route path="/farmland-add" element={<FarmlandAdd user={user} />} />
            <Route path="/farmers-list" element={<FarmersList user={user} />} />
            <Route
              path="/farmlands-list"
              element={<FarmlandsList user={user} />}
            />
            <Route path="/farmer" element={<Farmer user={user} />} />
            <Route path="/farmland" element={<Farmland user={user} />} />
            <Route path="/add-coordinates" element={<FarmlandCoordinates user={user} /> } />
          </Route>

          {/* <Route path="farmers/success" element={<FarmerExitRegister />} /> */}

          {/* <Route path="home" element={<Home />} /> */}

          {/* <Route path="farmlands-list" element={<FarmlandsList />} /> */}
          {/* <Route path="monitorings" element={<Monitorings />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
