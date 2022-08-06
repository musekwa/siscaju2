import { Forest, LegendToggle, PersonAdd } from "@mui/icons-material";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import { useGetPerformanceQuery, useGetGlobalStatisticsQuery } from "../../features/api/apiSlice";
import { toast } from "react-toastify";
import BarChart from "../charts/BarChart";
import PieChart from "../charts/PieChart";
import LineChart from "../charts/LineChart";
import DoughnutChart from "../charts/DoughnutChart";

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {

  const [globalStatsData, setGlobalStatsData] = useState({ datasets: [], });
  const [globalStatsOptions, setGlobalStatsOptions] = useState({});  
  const [pieStats, setPieStats] = useState([]);
  const [stats, setStats] = useState({});
  const [monthlyVisits, setMonthlyVisits] = useState({});
  const [farmlandStats, setFarmlandStats] = useState([]);

  const navigate = useNavigate()

  const {
    user,
    isLoading: userLoading,
    isError: userError,
    isSuccess: userSuccess,
    message,
  } = useSelector((state) => state.user);

  let {
    data,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    isSuccess: isStatsSuccess,
    isError: isStatsError,
    error: statsError,
  } = useGetGlobalStatisticsQuery();


  let {
    data: performance,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPerformanceQuery(user);

  const getToken =  (user) =>{
    if (!user) return ;
    const {token } = user;
    const decodedJWT =  JSON.parse(atob(token.split(".")[1]));
    
    return decodedJWT;
  }

  let decodedJWT =  getToken(user);


  useEffect(()=>{
  if (decodedJWT.exp * 1000 < Date.now()) {
      
      navigate("/signin");
      toast.error("A sua sessão expirou. Faça novamente o login!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return ;
  }

  if (isStatsSuccess) {
    // ------------------------------------
      
      const stats = data?.globalStatistics;
      const pieStats = data?.farmers;
      const monthlyVisits = data?.visits
     
      setStats(stats)
      setPieStats(pieStats);
      setMonthlyVisits(monthlyVisits)

    // ------------------------------------
  }

  }, [user, performance, isLoading, userLoading, isFetching, isError, isStatsSuccess, isStatsError, stats]);


  if (isLoading || isFetching || userLoading || isStatsLoading) {
    return <Spinner />;
  }

  return (
    <Box>
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
              <Link to="/monitorings-list">
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
      <BarChart
        stats={stats}
      />
      </Paper>

      <Paper sx={{ margin: "10px 10px 15px 10px", borderRadius: "10px" }}>
        <DoughnutChart 
          pieStats={pieStats}
          dataLabel="farmlands"
        />
      </Paper>
      <Paper sx={{ margin: "10px 10px 15px 10px", borderRadius: "10px" }}>
        <PieChart 
          pieStats={pieStats}
          dataLabel="farmers"
        />
       </Paper>

      <Paper sx={{ margin: "10px 10px 15px 10px", borderRadius: "10px" }}>
        <LineChart 
          monthlyVisits={monthlyVisits}
        />
      </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default Dashboard;
