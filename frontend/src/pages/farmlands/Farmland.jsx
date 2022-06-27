
import { Edit } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, Grid, Stack, styled, Typography } from '@mui/material'
import React, { Fragment } from 'react'
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

const Farmland = ({ user }) => {

    const location = useLocation()
   
    const { farmland, farmer } = location.state;


    farmland['divisions'] = sortDivisionsBySowingYear(farmland['divisions'])
    
    const getFromDivision = (division)=>{
      return {
        plantedArea: division?.plantedArea,
        trees: division?.trees,
        sowingYear: division.sowingYear,
        spacing: (division?.spacing?.category === 'irregular') ? 'irregular' : `regular (${division?.spacing?.x} x ${division?.spacing?.y})`,
        divisionType: (new Date().getFullYear() - division?.sowingYear) >= 5 ? 'Parcela Antiga' : 'Parcela Nova',  
        plantingTechniques:  division?.plantingTechniques.seedling === 'sementes'  ? '[sementes policlonal]' : `enxertia: [${division?.plantingTechniques?.grafting}]`,
      }
    }

  return (
    <Box>
      <Navbar pageDescription={'Pomar'} user={user} />
    
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
        <Typography align='left' sx={{ fontSize: "14px", color: "gray", fontWeight: 800, }}>
          Dados gerais do pomar
        </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button sx={{ width: "50px"}}>
            <Edit fontSize='small' sx={{ color: "rebeccapurple"}} />
          </Button>
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
        <Typography>{`[${farmland?.interCrops.join(", ").toString()}]`}</Typography>
      </Box>
    </Stack>

      {/* Divisions */}

    <Box sx={{ display: "block", justifyContent: "center", alignItems: "center"}}>

    {
      farmland?.divisions?.map((division, i)=>(
        <Box key={i} sx={{ width: "100%"}}>
        
        <Divider sx={{ mt: "10px", mb: "10px", }} />
        <div style={{ border: "2px solid #826DA3" }}>
          <Grid container sx={{ backgroundColor: "#826DA3" }}>
            <Grid item xs={9}>
              <Typography 
              variant='body2' 
              align='left'
              sx={{ fontWeight: 800, color: "#fff", padding: "5px", }}
              >
                  {`${getFromDivision(division).divisionType}: (${getFromDivision(division).sowingYear})`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button sx={{ width: "50px"}}>
                <Edit fontSize='small' sx={{ color: "#fff"}} />
              </Button>
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
          </div>
        </Box>
      ))
    }
    </Box>
    </Box>
    <Footer />
    </Box>
  )
}

export default Farmland