
import { Edit } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, Grid, Paper, Stack, styled, Typography } from '@mui/material'
import React from 'react'
import Navbar from '../../components/Navbar'
import { FaPencilAlt } from 'react-icons/fa'
import Footer from '../../components/Footer'
import { useLocation, useParams } from 'react-router-dom'
// import { useGetFarmersByQuery } from '../../features/farmers/farmerSlice'
import { useGetFarmlandsByQuery } from '../../features/api/apiSlice'
import Spinner from '../../components/Spinner'

const styledTextField = {
  "& label.Mui-focused": {
    color: "rebeccapurple"
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "rebeccapurple"
    }
  }
}

const UserStack = styled(Stack)(({theme})=>({
    gap: "10px",
    width: "100%",
    marginRight: "10px",

}))

const Farmer = ({ user }) => {

    const location = useLocation()
   
    const { farmer } = location.state;


    
    let filterBy = user?.role === 'Extensionista' 
                    ? user?.address?.district 
                    : user?.role === 'Gestor' 
                    ? user?.address?.province
                    : user?.role === 'Produtor'
                    ? user?.address?.territory : null;

    let { data: farmlands,  isLoading } = useGetFarmlandsByQuery(filterBy)


    // get all ther farmlands associated to this farmer
    let foundFarmlands = farmlands?.filter(farmland=>farmland.farmer._id === farmer._id)

    // normalize date format: dd/mm/aaaa
    const normalizeDate = (date)=>{
        return new Date(date).getDate() + '/'
             + (new Date(date).getMonth() + 1) + '/' 
             + new Date(date).getFullYear()
    }

    const GetTotalArea = () => {
      // get all the declared areas for all the farmlands
      let declaredAreas = foundFarmlands?.map((f) => f?.declaredArea);

      // get all the actual areas for all the farmlands
      let actualAreas = foundFarmlands?.map((f) => f?.actualArea);

      // get all  the trees from all the farmlands
      let totalTrees = foundFarmlands?.map((f) => f?.totalTrees);

      return {
        declaredArea: declaredAreas?.reduce((ac, el) => ac + el, 0),
        actualArea: actualAreas?.reduce((ac, el) => ac + el, 0),
        totalTrees: totalTrees?.reduce((ac, el) => ac + el, 0),
      };
    };

    if(isLoading) {
        return <Spinner />
    }




  return (
    <Box>
      <Navbar arrowBack={'block'} goBack={'/farmers-list'} pageDescription={'Produtor'} user={user} />
    
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
     
      <UserStack direction="row" onClick={()=>(true)} sx={{ m: "5px", }}>
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
        marginTop: "80px"  
       }}
    >
    <Box sx={{width: "100%", marginRight: "5px", textAlign: "right" }}>
      <Grid container sx={{ }}>
        <Grid item xs={9}>
        <Typography align='left' sx={{ fontSize: "14px", color: "#826DA3", fontWeight: 800, }}>
          Dados pessoais do produtor
        </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button sx={{ width: "50px"}}>
            <Edit fontSize='small' sx={{ color: "#826DA3"}} />
          </Button>
        </Grid>
      </Grid>
    </Box>
    {/* data nascimento */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%",textAlign: 'left'}} >
        Data de Nascimento:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {`${normalizeDate(farmer?.birthDate)}`}
      </Box>
    </Stack>

      {/* lugar nascimento */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Lugar de Nascimento:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>
          [ <span>{`${farmer?.birthPlace?.province} `}</span>
          <span>{`${farmer?.birthPlace?.district} `}</span>
          <span>{`${farmer?.birthPlace?.territory} `}</span>
          <span>{`${farmer?.birthPlace?.village} `}</span>]
        </Typography>
      </Box>
    </Stack>

     {/* endereco */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Residência:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>       
          [ <span>{`${farmer?.address?.province} `}</span>
          <span>{`${farmer?.address?.district} `}</span>
          <span>{`${farmer?.address?.territory} `}</span>
          <span>{`${farmer?.address?.village} `}</span>]
        </Typography>
      </Box>
    </Stack>

         {/* contacto */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Contacto:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmer?.phone ? farmer?.phone : 'Não tem telefone'}`}</Typography>
      </Box>
    </Stack>

   

      {/* pomares */}
    <Box sx={{ display: "block", justifyContent: "center", alignItems: "center"}}>
    <Paper 
      sx={{ 
        width: "100%", 
        borderRadius: "10px", 
        margin: "15px 0px 20px 0px", 
        }}>
      <Box sx={{ backgroundColor: "#826DA3", borderRadius: "10px 10px 0px 0px" }}>
        <Typography 
              variant='body2' 
              align='left'
              sx={{ fontWeight: 600, color: "#ffffff", padding: "5px", }}
              >
              Dados de pomares do produtor
        </Typography>
      </Box>
      <Box sx={{ padding: "5px 0px 5px 10px"}}>
      <Stack direction="row" sx={{ padding: "5px 0px 5px 0px" }} gap={2}>
        <Box sx={{ width: "60%", textAlign: 'left'}} >
          Número de pomares:
        </Box>
        <Box sx={{width: "40%", textAlign: 'left'}}>
          {`${foundFarmlands?.length}`}
        </Box>
      </Stack>

        {/* cajueiros */}
      <Stack direction="row" sx={{ padding: "5px 0px 5px 0px"}} gap={2}>
        <Box sx={{ width: "60%",  textAlign: 'left'}} >
          Número de cajueiros:
        </Box>
        <Box sx={{width: "40%", textAlign: 'left'}}>
          {`${GetTotalArea()?.totalTrees} árvores`}
        </Box>
      </Stack>


        {/* hectares */}
      <Stack direction="row" sx={{ padding: "5px 0px 5px 0px" }} gap={2}>
        <Box sx={{ width: "60%", textAlign: 'left'}} >
          Área total plantada:
        </Box>
        <Box sx={{width: "40%", textAlign: 'left'}}>
          {`${GetTotalArea()?.actualArea} hectares`}
        </Box>
      </Stack>


        {/* hectares */}
      <Stack direction="row" sx={{ padding: "5px 0px 5px 0px" }} gap={2}>
        <Box sx={{ width: "60%", textAlign: 'left'}} >
          Área total declarada:
        </Box>
        <Box sx={{width: "40%", textAlign: 'left'}}>
          {`${GetTotalArea()?.declaredArea} hectares`}
        </Box>
      </Stack>

            {/* producao */}
      <Stack direction="row" sx={{ padding: "5px 0px 5px 0px" }} gap={2}>
        <Box sx={{ width: "60%", textAlign: 'left'}} >
          Produção anual:
        </Box>
        <Box sx={{width: "40%",  textAlign: 'left'}}>
          N/A
        </Box>
      </Stack>
      </Box>
     </Paper>
    </Box>
    </Box>
    <Footer />
    </Box>
  )
}

export default Farmer