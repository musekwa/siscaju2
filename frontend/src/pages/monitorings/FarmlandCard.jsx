
import { ExpandMore, MoreVert, NotificationsNoneSharp, Preview, QueryStats } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Badge, Box, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 35;

const FarmlandCard = ({ farmland, }) => {

    // console.log('farmland', farmland)

    
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


    const navigate = useNavigate()

    const onAddMonitoring = (farmland) => {
        navigate("/monitoring-board", { state: { farmland, }});
    };

    // console.log('farmland --:', farmland)


  return (
    <Box 
        sx={{ 
            borderTop: "2px solid lightgray", 
            borderRadius: "10px 10px 0px 0px", 
            marginTop: "10px",  
        }}
    >
                
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
        <Grid item xs={2} >
            <IconButton onClick={()=>{}}> 
                <Badge badgeContent={4} color="error"  sx={{ mt: 1, mr: 1 }}>
                    <NotificationsNoneSharp fontSize="medium" sx={{ color: "rebeccapurple"}} />
                </Badge>
            </IconButton>
        </Grid>
        <Grid item xs={3}>
            <IconButton 
                aria-label="more"
                id="long-button"
                aria-controls={openMoreVert ? 'long-menu' : undefined}
                aria-expanded={openMoreVert ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClickMoreVert}
            >
                <Badge>
                    <MoreVert fontSize="medium" sx={{ color: "rebeccapurple"}}  />
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
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: "red" }}  />} aria-controls="panel1d-content" id="panel1d-header" sx={{ backgroundColor: "" }}>
                <Typography variant="body1" sx={{ textAlign: "left", color: "red" }}>
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
                  <MenuItem  selected onClick={()=>{
                    onAddMonitoring(farmland)
                    handleCloseMoreVert()
                  }}>
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
          </Box>
        )
    }

export default FarmlandCard