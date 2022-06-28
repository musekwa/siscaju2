import { Forest, LegendToggle, PersonAdd } from "@mui/icons-material";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import { useGetPerformanceQuery } from "../../features/api/apiSlice";

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  // const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  const {
    user,
    isLoading: userLoading,
    isError: userError,
    isSuccess: userSuccess,
    message,
  } = useSelector((state) => state.user);

  let {
    data: performance,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPerformanceQuery(user);

  useEffect(()=>{


  }, [user, performance, isLoading, userLoading, isFetching, isError]);

  // console.log('performance: ', performance)

  if (isLoading || isFetching || userLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      {/* { isLoading && <Spinner />} */}
      <Navbar
        arrowBack={'none'}
        pageDescription={
          user?.role === "Gestor"
            ? user?.address.province
            : user?.role === "Extensionista"
            ? user?.address.district
            : user?.role === "Produtor"
            ? user?.address.territory
            : null
        }
        user={user}
      />
      <Box sx={{         
        display: "flex",
        justifyContent: "center",
        maxWidth: "960px",
        margin: "30px 15px 10px 15px",   
     }}>
        <Grid
          container
          spacing={{ xs: 4, sm: 6, md: 8 }}
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Grid item xs={4}>
            <Item sx={{}}>
              <Link to="/farmers">
                <PersonAdd fontSize="large" sx={{ color: "rebeccapurple" }} />
                <Typography variant="body1" sx={{ color: "rebeccapurple" }}>
                  Registar
                  <br />
                  Produtor
                </Typography>
              </Link>
            </Item>
          </Grid>

          <Grid item xs={4} sx={{}}>
            <Item sx={{}}>
              <Link to="/farmland-add">
                <Forest fontSize="large" sx={{ color: "rebeccapurple" }} />
                <Typography variant="body1" sx={{ color: "rebeccapurple" }}>
                  Registar
                  <br />
                  Pomar
                </Typography>
              </Link>
            </Item>
          </Grid>

          <Grid item xs={4} sx={{}}>
            <Item>
              <Link to="/monitorings">
                <LegendToggle
                  fontSize="large"
                  sx={{ color: "rebeccapurple" }}
                />
                <Typography variant="body1" sx={{ color: "rebeccapurple" }}>
                  Monitorar
                  <br />
                  Pomar
                </Typography>
              </Link>
            </Item>
          </Grid>
        </Grid>
      </Box>


    <Box       
    sx={{ 
        maxWidth: "960px", 
        padding: "10px",  
        position: "relative", 
        bottom: "80px", 
        marginTop: "70px"  }}>
     
     <Paper sx={{ margin: "10px 10px 15px 10px", borderRadius: "10px" }}>
      <Link to="#" sx={{}}>
      <Box sx={{ 
        backgroundColor: "#826DA3", 
        padding: "5px", 
        borderRadius: "10px 10px 0px 0px" 
        }}
      >

        <Typography variant="body1" sx={{ textAlign: "center", color: "#ffffff" }}>
          Desempenho pessoal <br /> ({user?.fullname})
        </Typography>
      </Box>
      <Box sx={{ margin: "15px" }}>
        <Grid
          container
          spacing={{ xs: 4, sm: 6, md: 8 }}
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Grid item sx={{}} xs={4}>
            {/* <Link to="#" sx={{}}> */}
              <Typography variant="body2" sx={{}}>
                {performance?.user?.farmers?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{}}>
                Produtores
                <br />
                registados
              </Typography>
            {/* </Link> */}
          </Grid>
          <Grid item sx={{}} xs={4}>
            {/* <Link to="#" sx={{}}> */}
              <Typography variant="body2" sx={{}}>
                {performance?.user?.farmlands?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{}}>
                Pomares
                <br />
                registados
              </Typography>
            {/* </Link> */}
          </Grid>

          <Grid item sx={{}} xs={4}>
            {/* <Link to="#" sx={{}}> */}
              <Typography variant="body2" sx={{}}>
                {0}
              </Typography>
              <Typography variant="body2" sx={{}}>
                Pomares
                <br />
                Monitorados
              </Typography>
            
          </Grid>
        </Grid>
      </Box>
      </Link>
      </Paper>
      { user?.role === "Extensionista" && (
      <Paper sx={{ margin: "10px 10px 15px 10px", borderRadius: "10px" }}>
      <Link to="#" sx={{}}>
      <Box sx={{ 
        backgroundColor: "#826DA3", 
        padding: "5px",
         borderRadius: "10px 10px 0px 0px" 
        }}
      >
        <Typography variant="body1" sx={{ textAlign: "center", color: "#ffffff" }}>
          Desempenho distrital <br /> ({user?.address.district})
        </Typography>
      </Box>
      <Box sx={{ margin: "15px" }}>
        <Grid
          container
          spacing={{ xs: 4, sm: 6, md: 8 }}
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Grid item sx={{}} xs={4}>
            {/* <Link to="#" sx={{}}> */}
              <Typography variant="body2" sx={{}}>
                {performance?.district?.farmers?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{}}>
                Produtores
                <br />
                registados
              </Typography>
            {/* </Link> */}
          </Grid>
          <Grid item sx={{}} xs={4}>
            {/* <Link to="#" sx={{}}> */}
              <Typography variant="body2" sx={{}}>
                {performance?.district?.farmlands?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{}}>
                Pomares
                <br />
                registados
              </Typography>
            {/* </Link> */}
          </Grid>

          <Grid item sx={{}} xs={4}>
            {/* <Link to="#" sx={{}}> */}
              <Typography variant="body2" sx={{}}>
                {0}
              </Typography>
              <Typography variant="body2" sx={{}}>
                Pomares
                <br />
                Monitorados
              </Typography>
            
          </Grid>
        </Grid>
      </Box>
      </Link>
      </Paper>
    )}

      {user?.role === "Gestor" ? (
      <Paper sx={{ margin: "10px 10px 15px 10px", borderRadius: "10px" }}>
      <Link to="#" sx={{}}>
      <Box sx={{ backgroundColor: "#826DA3", padding: "5px", borderRadius: "10px 10px 0px 0px" }}>
        <Typography variant="body1" sx={{ textAlign: "center", color: "#ffffff" }}>
            Desempenho provincial <br /> ({user?.address.province})
          </Typography>
          </Box>
          <Box sx={{ margin: "15px" }}>
            <Grid
              container
              spacing={{ xs: 4, sm: 6, md: 8 }}
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              <Grid item sx={{}} xs={4}>
                {/* <Link to="#" sx={{}}> */}
                  <Typography variant="body2" sx={{}}>
                    {performance?.province?.farmers?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{}}>
                    Produtores
                    <br />
                    registados
                  </Typography>
                {/* </Link> */}
              </Grid>
              <Grid item sx={{}} xs={4}>
                {/* <Link to="#" sx={{}}> */}
                  <Typography variant="body2" sx={{}}>
                    {performance?.province?.farmlands?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{}}>
                    Pomares
                    <br />
                    registados
                  </Typography>
                {/* </Link> */}
              </Grid>

              <Grid item sx={{}} xs={4}>
                {/* <Link to="#" sx={{}}> */}
                  <Typography variant="body2" sx={{}}>
                    {0}
                  </Typography>
                  <Typography variant="body2" sx={{}}>
                    Pomares
                    <br />
                    Monitorados
                  </Typography>
                {/* </Link> */}
              </Grid>
            </Grid>
          </Box>
          </Link>
       </Paper>
      ) : null}
      </Box>
      <Footer />
    </Box>
  );
};

export default Dashboard;
