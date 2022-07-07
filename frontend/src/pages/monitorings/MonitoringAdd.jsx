import React, {  startTransition } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import { Box, Card, CardHeader, Grid, Paper, Stack, } from "@mui/material";
import Footer from "../../components/Footer";
import { AddCircle } from "@mui/icons-material";
import {useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
// import SearchModal from "../../components/SearchModal";
import { toast } from "react-toastify";
import { useGetFarmersByQuery } from "../../features/api/apiSlice";
import { useEffect } from "react";

const MonitoringAdd = ({ user }) => {
  let filterBy =
    user?.role === "Extensionista"
      ? user?.address?.district
      : user?.role === "Gestor"
      ? user?.address?.province
      : user?.role === "Produtor"
      ? user?.address?.territory
      : null;

  const {
    data: farmers,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
  } = useGetFarmersByQuery(filterBy);

  const navigate = useNavigate();



  useEffect(()=>{
    if (farmers && farmers.length === 0) {
      toast.warning(
        "Primeiro, regista-se produtores (proprietários) de pomares!",
        {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    navigate("/");
  }
  }, [farmers])

//   if (isLoading || isFetching) {
//       return <Spinner />
//   }

//   const onAddMonitoring = (farmlandId) => {
//     let farmer = farmers.find((farmer) => farmer._id === farmerId);
//     startTransition(() => {
//       navigate("/farmlands", { state: { farmer: farmer } });
//     });
//   };

  return (
    <Box>
      <Navbar
        // pageDescription={"Produtores"}
        // isManageSearch={true}
        // isSearchIcon={true}
        // user={user}
      />
      <Box sx={{ position: "relative", bottom: "60px", marginTop: "100px"  }}>
        
        <Stack direction="row" spacing={2} sx={{ margin: "15px"}}>
          <Card sx={{ maxWidth: 250 }}>

            <CardHeader

              title="Limpeza"
              subheader="September 14, 2016"
            />

          </Card>
          <Card sx={{ maxWidth: 250 }}>
            <CardHeader

              title="Shrimp and Chorizo Paella"
              subheader="September 14, 2016"
            />
          </Card>

        </Stack>

        <Stack direction="row">

          
        </Stack>

        <Stack direction="row">

          
        </Stack>

      </Box>
      <Footer />
    </Box>
  );
};

export default MonitoringAdd;
