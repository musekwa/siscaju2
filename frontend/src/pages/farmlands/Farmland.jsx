
import { Add, Delete, DeleteForever, Edit, MoreVert, NaturePeople, NoTransferTwoTone, Preview, QueryStats, Send, TransferWithinAStation } from '@mui/icons-material'
import { Avatar, Badge, Box, Button, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Paper, Stack, styled, Typography } from '@mui/material'
import React, { Fragment, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useLocation } from 'react-router-dom'




const UserStack = styled(Stack)(({theme})=>({
    gap: "5px",
    width: "100%",
    marginRight: "10px",

}))

const sortDivisionsBySowingYear = (divisions)=>{
  return divisions.sort(function (a, b) {
      return b.sowingYear - a.sowingYear;
  });
}

const ITEM_HEIGHT = 52;

const Farmland = ({ user }) => {

    const location = useLocation()
   
    const { farmland, farmer } = location.state;


    farmland['divisions'] = sortDivisionsBySowingYear(farmland['divisions'])


  // --------- start Farmland MoreVert ------------------------------------

  const [anchorElFarmlandMoreVert, setAnchorElFarmlandMoreVert] = useState(null);
  const openFarmlandMoreVert = Boolean(anchorElFarmlandMoreVert);

  const handleClickFarmlandMoreVert = (event) => {
    setAnchorElFarmlandMoreVert(event.currentTarget);
  };

  const handleCloseFarmlandMoreVert = () => {
    setAnchorElFarmlandMoreVert(null);
  };
 
  // ---------------- end MoreVert -----------------------------------------------
    
    // --------- start Division MoreVert ------------------------------------

  const [anchorElMoreVert, setAnchorElMoreVert] = useState(null);
  const openMoreVert = Boolean(anchorElMoreVert);

  const handleClickMoreVert = (event) => {
    setAnchorElMoreVert(event.currentTarget);
  };

  const handleCloseMoreVert = () => {
    setAnchorElMoreVert(null);
  };
 
  // ---------------- end MoreVert -----------------------------------------------


    const getFromDivision = (division)=>{
      return {
        plantedArea: division?.plantedArea,
        trees: division?.trees,
        sowingYear: division.sowingYear,
        spacing: (division?.spacing?.category === 'irregular') 
                  ? 'irregular' 
                  : `regular (${division?.spacing?.x} x ${division?.spacing?.y})`,
        divisionType: (new Date().getFullYear() - division?.sowingYear) >= 5 ? 'Parcela Antiga' : 'Parcela Nova',  
        plantingTechniques:  division?.plantingTechniques.seedling === 'sementes policlonais'  
                  ? '[ sementes policlonais ]' 
                  : `enxertados: [ ${division?.plantingTechniques?.grafting.join(', ')} ]`,
      }
    }

  return (
    <Box>
      <Navbar arrowBack={'block'} goBack={'/farmlands-list'} pageDescription={'Pomar'} user={user} />
    
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        maxWidth: "960px",
        marginTop: "45px",
        marginLeft: "15px"
      }}
    >

      {/* Start Farmer's Profile */}
     
      <UserStack direction="row" onClick={()=>(true)} sx={{ m: "10px", }}>
        <Avatar sx={{ width: "50px", height: "50px"}} src="" />
        <Box sx={{ textAlign: "center", width: "80%", marginRight: "5px" }}>
            <Typography variant='body1'>{`${farmer?.fullname}`}</Typography>
            <Typography variant='body2'>({`${farmer?.category}`})</Typography>
        </Box>
      </UserStack>
    </Box>

    <Divider sx={{ mt: "10px", mb: "10px", }} />

    <Box 
      sx={{ 
        maxWidth: "960px", 
        padding: "10px", 
        marginLeft: "10px",  
        marginRight: "10px",  
        position: "relative", 
        bottom: "80px", 
        marginTop: "80px"  }}>

    {/* dados do pomar */}
    <Stack direction="row" sx={{ padding: "5px 0px 5px 0px"}} gap={2}>
      <Box sx={{ width: "50%",textAlign: 'left'}} >
        {farmer?.village ? 'Localidade (Designação):' : 'Designação:' }
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {farmer?.village ?  `${farmer?.address?.village} (${farmland?.label}):` : `${farmland?.label}`}
      </Box>
    </Stack>

      {/* Dados Immutaveis do pomar  */}
    <Stack direction="row" sx={{ padding: "5px 0 5px 0px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Distrito (posto):
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.district} (${farmland?.territory ? farmland?.territory : 'N/A' })` }</Typography>
      </Box>
    </Stack>

    {/* Dados mutaveis do pomar  */}

    <Divider  sx={{ mt: "10px", mb: "10px", }} />
    <Box sx={{width: "100%", marginRight: "5px", textAlign: "right" }}>
      <Grid container sx={{ }}>
        <Grid item xs={9}>
        <Typography align='left' sx={{ fontSize: "14px", color: "#826DA3", fontWeight: 800, }}>
          Dados gerais do pomar
        </Typography>
        </Grid>
        <Grid item xs={3}>
          <IconButton 
              aria-label="more"
              id="long-button"
              aria-controls={openFarmlandMoreVert ? 'long-menu' : undefined}
              aria-expanded={openFarmlandMoreVert ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickFarmlandMoreVert}
          >
              <Badge>
                  <MoreVert fontSize="medium" sx={{ color: "#826DA3"}}  />
              </Badge>
          </IconButton>
          {/* <IconButton sx={{ }}>
            <Edit fontSize='small' sx={{ color: "#826DA3"}} />
          </IconButton> */}
        </Grid>
      </Grid>

    </Box>

    {/*  */}
    
    <Stack direction="row" sx={{ padding: "5px 0px 5px 0px" }} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Total declarada:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.declaredArea} hectares`}</Typography>
      </Box>
    </Stack>

        {/*  */}
    <Stack direction="row" sx={{ padding: "5px 0px 5px 0px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Total plantada:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.actualArea} hectares`}</Typography>
      </Box>
    </Stack>

     {/*  */}
    <Stack direction="row" sx={{ padding: "5px 0px 5px 0px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
       Total Cajueiros:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.totalTrees} árvores`}</Typography>
      </Box>
    </Stack>

         {/*  */}
    <Stack direction="row" sx={{ padding: "5px 0px 5px 0px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
       Culturas consorciadas:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`[ ${farmland?.interCrops.join(", ").toString()} ]`}</Typography>
      </Box>
    </Stack>

      {/* Divisions */}

    <Box sx={{ display: "block", justifyContent: "center", alignItems: "center"}}>

    {
      farmland?.divisions?.map((division, i)=>(
        <Paper key={i} sx={{ width: "100%", borderRadius: "10px", marginTop: "15px"}}>

          <Grid container sx={{ backgroundColor: "#826DA3", borderRadius: "10px 10px 0px 0px" }}>
            <Grid item xs={10}>
              <Typography 
              variant='body2' 
              align='left'
              sx={{ fontWeight: 600, color: "#ffffff", padding: "5px", }}
              >
                  {`${getFromDivision(division).divisionType}: (${getFromDivision(division).sowingYear})`}
              </Typography>
            </Grid>
            <Grid item xs={2}>
                    <IconButton 
                        aria-label="more"
                        id="long-button"
                        aria-controls={openMoreVert ? 'long-menu' : undefined}
                        aria-expanded={openMoreVert ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClickMoreVert}
                    >
                        <Badge>
                            <MoreVert fontSize="medium" sx={{ color: "#eee"}}  />
                        </Badge>
                    </IconButton>
            </Grid>
          </Grid>
          {/* <Box sx={{ width: "100%", height: "30px", p: 1, backgroundColor: "lightgray"}}>
            </Box>
          
          <Box sx={{width: "100%", marginRight: "5px", textAlign: "right" }}>

         </Box> */}
           
          <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
              Área plantada:
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
              {`${getFromDivision(division)?.plantedArea} hectares`}
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
              Cajueiros:
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
              {`${getFromDivision(division)?.trees} árvores`}
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
              Compasso:
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
              {`${getFromDivision(division)?.spacing}`}
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
              Técnica de plantio:
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
              {`${getFromDivision(division)?.plantingTechniques.toString()}`}
            </Box>
          </Stack>
        </Paper>
      ))
    }
    </Box>
    </Box>
        {/* -----------------------start Farmland MoreVert menu ------------- */}
        <Menu
            id="long-menu"
            MenuListProps={{
            'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorElFarmlandMoreVert}
            open={openFarmlandMoreVert}
            onClose={handleCloseFarmlandMoreVert}
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
            <MenuItem selected onClick={handleCloseFarmlandMoreVert}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                <Typography>
                    Adicionar divisão
                </Typography>
            </MenuItem>
            {/* <Divider />
            <MenuItem onClick={handleCloseFarmlandMoreVert}>
                <ListItemIcon>
                    <Preview />
                </ListItemIcon>
                <Typography>
                    Ver o estado da divisão
                </Typography>
            </MenuItem> */}
             <Divider />
            <MenuItem onClick={handleCloseFarmlandMoreVert}>
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <Typography>
                    Editar pomar
                </Typography>
            </MenuItem>
             <Divider />
            <MenuItem onClick={handleCloseFarmlandMoreVert}>
                <ListItemIcon>
                    <NaturePeople />
                </ListItemIcon>
                <Typography>
                    Transferir pomar
                </Typography>
            </MenuItem>

            <Divider />
            <MenuItem selected onClick={handleCloseFarmlandMoreVert}>
                <ListItemIcon>
                    <Delete />
                </ListItemIcon>
                <Typography>
                   Apagar pomar
                </Typography>
            </MenuItem>
        </Menu>


          {/* -------------------start Division MoreVert menu -------------- */}
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

            {/* <MenuItem onClick={handleCloseMoreVert}>
                <ListItemIcon>
                    <Preview />
                </ListItemIcon>
                <Typography>
                    Ver o estado da divisão
                </Typography>
            </MenuItem>
             <Divider /> */}
             
            <MenuItem onClick={handleCloseMoreVert}>
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <Typography>
                    Editar divisão
                </Typography>
            </MenuItem>
             <Divider />
            <MenuItem selected onClick={handleCloseMoreVert}>
                <ListItemIcon>
                    <Delete />
                </ListItemIcon>
                <Typography>
                   Apagar divisão
                </Typography>
            </MenuItem>
           
        </Menu>
      {/* --------------------------end MoreVert menu --------------------- */}

    <Footer />
    </Box>
  )
}

export default Farmland