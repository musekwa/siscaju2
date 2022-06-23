
import { Edit } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, Stack, styled, Typography } from '@mui/material'
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

    <Box sx={{ maxWidth: "960px", padding: "10px", marginLeft: "15px" }}>

    {/* dados do pomar */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%",textAlign: 'left'}} >
        {farmer?.village ? 'Localidade (Designação):' : 'Designação:' }
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {farmer?.village ?  `${farmer?.address?.village} (${farmland?.label}):` : `${farmland?.label}`}
      </Box>
    </Stack>

      {/* Dados Immutaveis do pomar  */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
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
      <Button sx={{ width: "50px"}}>
          <Edit fontSize='small' sx={{ color: "rebeccapurple"}} />
      </Button>
    </Box>

    {/*  */}
    <Stack direction="row" sx={{ padding: "0px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Área declarada:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.declaredArea} hectares`}</Typography>
      </Box>
    </Stack>

        {/*  */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Área plantada:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.actualArea} hectares`}</Typography>
      </Box>
    </Stack>

     {/*  */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
       Cajueiros:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmland?.totalTrees} árvores`}</Typography>
      </Box>
    </Stack>

         {/*  */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
       Culturas consorciadas:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`[${farmland?.interCrops.join(", ").toString()}]`}</Typography>
      </Box>
    </Stack>

      {/* Divisions */}

    {
      farmland?.divisions?.map((division, i)=>(
        <Fragment key={i}>
        <Divider sx={{ mt: "10px", mb: "10px", }} />
          <Box sx={{ width: "100%", height: "30px", p: 1, backgroundColor: "rebeccapurple"}}>
            <Typography variant='body2' color="#eee" sx={{ fontWeight: 600, textAlign: "center" }}>{`${getFromDivision(division).divisionType}: (${getFromDivision(division).sowingYear})`}</Typography>
          </Box>
          <Box sx={{width: "100%", marginRight: "5px", textAlign: "right" }}>
            <Button sx={{ width: "50px"}}>
                <Edit fontSize='small' sx={{ color: "rebeccapurple"}} />
            </Button>
         </Box>
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
        </Fragment>
      ))
    }
    <Divider sx={{ mt: "10px", mb: "10px", }} />
    </Box>
    <Footer />
    </Box>
  )
}

export default Farmland