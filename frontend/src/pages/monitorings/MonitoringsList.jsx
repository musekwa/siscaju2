import React, {  Fragment, useState} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Badge,
  Box,
  Fab,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Stack,
  styled,
  Tooltip,
} from "@mui/material";
import Footer from "../../components/Footer";
import { useNavigate,  Link } from "react-router-dom";
import { Add, ArrowDropDown, ExpandMore, KeyboardArrowDown, KeyboardArrowUp, MoreVert, NotificationsNoneSharp, Preview, QueryStats } from "@mui/icons-material";
import Spinner from "../../components/Spinner";
import SearchModal from "../../components/SearchModal";
import { useGetFarmlandsByQuery } from "../../features/api/apiSlice";
import { useEffect } from "react";
import FarmlandCard from "./FarmlandCard";



const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "&:hover": {
    cursor: "pointer",
  },
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const options = [
  'Monitorar pomar',
  'Ver o estado do pomar',
];




const MonitoringsList = ({ user }) => {





  const navigate = useNavigate();
  const [byFarmers, setByFarmers] = useState({});
  

  let filterBy =
    user?.role === "Extensionista"
      ? user?.address?.district
      : user?.role === "Gestor"
      ? user?.address?.province
      : user?.role === "Produtor"
      ? user?.address?.territory
      : null;
  
  const { 
      data: farmlands, isError, isSuccess, error, isLoading, 
  } = useGetFarmlandsByQuery(filterBy, { fixedCacheKey: "farmlands", });

  useEffect(()=>{
    
    if (farmlands && farmlands.length > 0) {

      let groupedByFarmers = { }

      farmlands?.map(farmland=> {

        if (!groupedByFarmers.hasOwnProperty(farmland.farmer._id)) {
          groupedByFarmers[`${farmland.farmer._id}`] = new Array(farmland);
        }
        else {
          groupedByFarmers[`${farmland.farmer._id}`].push(farmland);
        }
      })

      setByFarmers(prevState=>{
        return groupedByFarmers;
      })
    }

  }, [farmlands])



  if (isLoading) {
    return <Spinner />;
  }



  const getTreesAverageAge = (divisions) => {
    let sum = 0;
    divisions.forEach((div) => {
      sum += div.sowingYear;
    });
    return new Date().getFullYear() - Math.ceil(sum / divisions?.length);
  };


  const normalizeDate = (date) => {
    return (
      new Date(date).getDate() +
      "/" +
      (new Date(date).getMonth() + 1) +
      "/" +
      new Date(date).getFullYear()
    );
  };

 
  return (
    <Box>
      <Navbar
        pageDescription={user?.address?.district}
        isManageSearch={true}
        isSearchIcon={true}
        user={user}
      />
      {farmlands && farmlands.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center ",
            width: "100%",
            height: "90vh",
          }}
        >
          <Box sx={{  maxWidth: "500px" }}>
            <Typography>Nenhum pomar para ser monitorado!</Typography>
          </Box>
        </Box>
      )}

    {
        (isError && !farmlands) && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center ", width: "100%", height: "90vh", }}>
                <Box sx={{  maxWidth: "500px"}}>
                <Typography sx={{ color: "red" }} >
                    Verifique a conexão da Internet e volte a carregar!
                </Typography>
                </Box>
            </Box>
        )
    }

    <Box sx={{ position: "relative", bottom: "60px", marginTop: "100px"  }}>
      <List
        sx={{
          marginTop: "45px",
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >

    {
      Object?.keys(byFarmers)?.map(farmerId =>(
        <Paper key={farmerId?.toString()}  sx={{ margin: "15px 15px 0px 15px", borderRadius: "10px" }}>

            <Box  sx={{ display: "flex", alignItems: "center", backgroundColor: "#826DA3", padding: "5px", borderRadius: "10px 10px 0px 0px"  }}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="" />
              </ListItemAvatar>
              <Typography
                variant="body2"
                sx={{ fontWeight: 400, fontSize: "14px", color: "#ffffff" }}
              >
                {`${byFarmers[`${farmerId}`][0]?.farmer?.fullname}`}
                {" "}
                {`(${byFarmers[`${farmerId}`][0]?.farmer?.category})`}
              </Typography>
            </Box>

          <Fragment>

          {
            byFarmers[farmerId]?.map(farmland=>(
              <FarmlandCard
                key={farmland._id}
                farmland={farmland}
              />
        ))}
        </Fragment>
      </Paper>         
      )) }
      </List>
      </Box>

      <SearchModal open={false} />
      <Footer />
    </Box>
  );
};

export default MonitoringsList;
