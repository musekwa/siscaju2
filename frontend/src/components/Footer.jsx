import React, { startTransition, useState } from 'react'
import {
  Dashboard,
  Forest,
  LegendToggle,
  Group,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, CssBaseline, Paper } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';



const styledBottomNavigation = {
  "& .Mui-selected": {
    color: "rebeccapurple",
  },
  "& .MuiIcon-colorAction": {
    color: "rebeccapurple",
    backgroundColor: "rebeccapurple"
  }
}


const Footer = ( ) => {

  const [innerScreenHeight, setInnerScreenHeight] = useState(null)
  const [actionValue, setActionValue] = useState('')

 const navigate = useNavigate()
 const location = useLocation()


//  let innerScreenHeight = window.innerHeight;

  useEffect(()=>{

    setInnerScreenHeight(window.innerHeight)

  }, [innerScreenHeight])

  return (
    // <Box sx={{ pb: 7, display: { xs: "block", sm: "none" } }} ref={ref}>
    // <Box  sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 }}>
    <Box   sx={{ position: "fixed", top: {innerScreenHeight} +'px', left: 0, right: 0, zIndex: 1 }}> 
      <CssBaseline />
    
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0,  }}
        elevation={3}
      >
        <BottomNavigation
        // sx={styledBottomNavigation}
          showLabels
          // value={actionValue}
          // onChange={(event, newValue) => {
          //   setActionValue(newValue);
          //   // transition()
          // }}
        >
          <BottomNavigationAction   
            // onClick={toDashboard} 
            label="Painel" 
            value="dashboard"
            icon={<Dashboard sx={{}} />} 
            onClick={()=>{
              navigate('/')
            }}
          />
          <BottomNavigationAction   
            // onClick={toMonitorings} 
            label="Monitoria" 
            value="monitoring"
            icon={<LegendToggle />} 
            onClick={()=>{
              navigate('/monitorings-list')
            }}
          />
          <BottomNavigationAction  
            // onClick={toFarmersList} 
            label="Produtores" 
            value="farmers"
            icon={<Group />} 
            onClick={()=>{
              navigate('/farmers-list')
            }}
          />
          <BottomNavigationAction  
            // onClick={toFarmlandsList} 
            label="Pomares" 
            value="farmlands"
            icon={<Forest />} 
            onClick={()=>{
              navigate('/farmlands-list')
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Footer;
