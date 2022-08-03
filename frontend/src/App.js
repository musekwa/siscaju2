
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/users/Login";
import UserRegister from "./pages/users/UserRegister";
import FarmerRegister from "./pages/farmers/FarmerRegister";
import FarmlandRegister from "./pages/farmlands/FarmlandRegister";
// import Monitorings from "./pages/Monitorings";
import MonitoringsList from "./pages/monitorings/MonitoringsList";
import MonitoringBoard from "./pages/monitorings/MonitoringBoard";
import FarmersList from "./pages/farmers/FarmersList";
import FarmlandsList from "./pages/farmlands/FarmlandsList";
import NotFound from "./pages/NotFound";
import FarmlandDivisionRegister from "./pages/farmlands/FarmlandDivisionRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import FarmlandAdd from "./pages/farmlands/FarmlandAdd";
import Farmer from "./pages/farmers/Farmer";
import Farmland from "./pages/farmlands/Farmland";
import PasswordReset from "./pages/users/PasswordReset"
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { apiSlice } from "./features/api/apiSlice";
import Spinner from "./components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import FarmlandCoordinates from "./pages/farmlands/FarmlandCoordinates";
import { resetUser } from "./features/users/userSlice"
import PasswordUpdate from "./pages/users/PasswordUpdate";
import WeedingForm from "./pages/monitorings/WeedingForm";
import PruningForm from "./pages/monitorings/PruningForm";
import DiseaseForm from "./pages/monitorings/DiseaseForm";
import PlagueForm from "./pages/monitorings/PlagueForm";
import InsecticideForm from './pages/monitorings/InsecticideForm';
import FungicideForm from './pages/monitorings/FungicideForm';
import HarvestForm from './pages/monitorings/HarvestForm';
import MonitoringReport from "./pages/monitorings/MonitoringReport";
import Photo from './components/Photo';
import Image from './components/Image'

const localUser = JSON.parse(localStorage.getItem("user"));

const Dashboard = lazy(()=>import("./pages/dashboard/Dashboard"));

function App() {


const dispatch = useDispatch()
const [isValidToken, setIsValidToken] = useState(true);

const { user, isLoading, isError } = useSelector((state) => state.user);


  useEffect(() => {



}, [isValidToken, isLoading, user, localUser]);
  

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
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route
            path="/password-update/:userId/:token"
            element={<PasswordUpdate />}
          />

          {/**  Dashboard */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farmers" element={<FarmerRegister />} />
            <Route path="/farmlands" element={<FarmlandRegister />} />
            <Route
              path="/divisions"
              element={<FarmlandDivisionRegister user={user} />}
            />
            <Route path="/farmland-add" element={<FarmlandAdd user={user} />} />
            <Route path="/farmers-list" element={<FarmersList />} />
            <Route
              path="/farmlands-list"
              element={<FarmlandsList user={user} />}
            />
            <Route path="/farmer" element={<Farmer user={user} />} />
            <Route path="/farmland" element={<Farmland user={user} />} />
            <Route
              path="/add-coordinates"
              element={<FarmlandCoordinates user={user} />}
            />
            <Route path="/add-photo" element={<Image user={user} />} />

            <Route
              path="/monitorings-list"
              element={<MonitoringsList user={user} />}
            />
            <Route
              path="/monitoring-board"
              element={<MonitoringBoard user={user} />}
            />

            <Route path="/monitoring-report" element={<MonitoringReport user={user} /> } />

            <Route path="/weeding-add" element={<WeedingForm user={user} />} />
            <Route path="/pruning-add" element={<PruningForm user={user} />} />
            <Route path="/disease-add" element={<DiseaseForm user={user} />} />
            <Route path="/plague-add" element={<PlagueForm user={user} />} />
            <Route
              path="/insecticide-add"
              element={<InsecticideForm user={user} />}
            />
            <Route
              path="/fungicide-add"
              element={<FungicideForm user={user} />}
            />
            <Route
              path="/harvest-add"
              element={<HarvestForm user={user} />}
            />
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
