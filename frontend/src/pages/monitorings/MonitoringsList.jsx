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

const ITEM_HEIGHT = 35;


const MonitoringsList = ({ user }) => {

    // --------- start MoreVert ------------------------------------

  const [anchorElMoreVert, setAnchorElMoreVert] = useState(null);
  const openMoreVert = Boolean(anchorElMoreVert);

  const handleClickMoreVert = (event) => {
    setAnchorElMoreVert(event.currentTarget);
  };

  const handleCloseMoreVert = () => {
    setAnchorElMoreVert(null);
  };
 
  // ---------------- end MoreVert -----------------------------------------------

  // --------------- start Accordion --------------------------------

  const [expanded, setExpanded] = useState(false);

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ---------------- end Accordion ---------------------


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


  const onAddMonitoring = () => {
    navigate("/monitoring-add");
  };

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
            <Box key={farmland?._id.toString()} 
              sx={{ 
                borderTop: "2px solid #826DA3", 
                borderRadius: "10px 10px 0px 0px", 
                marginTop: "10px",  }}>
                      
            <Grid container sx={{ mt: 1, mr: 2, ml: 2, mb: 1, }}>
                <Grid item xs={7}>
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "gray", textAlign: "left", }}
                    >
                        {`${farmland?.farmlandType}`}{" "} <br />
                        <span style={{ fontWeight: 400, fontSize: "11px" }}>
                        (
                        {`${farmland?.farmer?.address?.territory}: ${farmland?.label}`}
                        )
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={2.5} >
                    <IconButton onClick={()=>{}}> 
                        <Badge badgeContent={4} color="error"  sx={{ mt: 1, mr: 1 }}>
                            <NotificationsNoneSharp fontSize="medium" sx={{ color: "#826DA3"}} />
                        </Badge>
                    </IconButton>
                </Grid>
                <Grid item xs={2.5}>
                    <IconButton 
                        aria-label="more"
                        id="long-button"
                        aria-controls={openMoreVert ? 'long-menu' : undefined}
                        aria-expanded={openMoreVert ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClickMoreVert}
                    >
                        <Badge>
                            <MoreVert fontSize="medium" sx={{ color: "#826DA3"}}  />
                        </Badge>
                    </IconButton>
                </Grid>
            </Grid>

             {/* -----------------------start recommendation-------------------------------------------------------------- */}

              <Stack sx={{  }}>
                    <Accordion 
                      expanded={expanded === farmland._id } 
                      onChange={handleChangeAccordion(farmland._id)}
                      >
                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#826DA3" }}  />} aria-controls="panel1d-content" id="panel1d-header" sx={{ backgroundColor: "#eee" }}>
                          <Typography variant="body1" sx={{ textAlign: "left", color: "#826DA3" }}>
                              Acção recomendada
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack sx={{ }} spacing={1}>
                                <Alert  severity="error" >
                                    This is an error alert 
                                </Alert>
                                <Alert  severity="error">
                                    This is an error alert 
                                </Alert>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
        </Box>
      ))}
      </Fragment>
      </Paper>       
      )) }
      </List>
      </Box>
      {/* -------------------start MoreVert menu -------------- */}
        <Menu
            id="long-menu"
            MenuListProps={{
            'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorElMoreVert}
            open={openMoreVert}
            onClose={handleCloseMoreVert}
            PaperProps={{
            style: {
                maxHeight: ITEM_HEIGHT * 3.5,
                // width: '20ch',
            },
            }}
        >
            {/* {options.map((option) => (
            <MenuItem key={option} selected={option === 'Monitorar pomar'} onClick={handleCloseMoreVert}>
                {option}
            </MenuItem>
            ))} */}
            <MenuItem selected onClick={handleCloseMoreVert}>
                <ListItemIcon>
                    <QueryStats />
                </ListItemIcon>
                <Typography>
                    Monitorar pomar
                </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseMoreVert}>
                <ListItemIcon>
                    <Preview />
                </ListItemIcon>
                <Typography>
                    Ver o estado do pomar
                </Typography>
            </MenuItem>
        </Menu>
      {/* --------------------------end MoreVert menu --------------------- */}
      <SearchModal open={false} />
      <Footer />
    </Box>
  );
};

export default MonitoringsList;
