
import { Edit } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, Grid, Stack, styled, Typography } from '@mui/material'
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
      <Navbar pageDescription={'Produtor'} user={user} />
    
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

    <Divider sx={{ mt: "10px", mb: "5px", }} />

    <Box sx={{ maxWidth: "960px", padding: "0px 5px 5px 5px",  marginLeft: "15px" }}>
    <Box sx={{width: "100%", marginRight: "0px 5px 5px 5px", textAlign: "right" }}>
      <Button sx={{ width: "50px"}}>
          <Edit fontSize='small' sx={{ color: "rebeccapurple"}} />
      </Button>
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
        <Typography>{`${farmer?.birthPlace?.province}`}</Typography>
        <Typography>{`${farmer?.birthPlace?.district}`}</Typography>
        <Typography>{`${farmer?.birthPlace?.territory}`}</Typography>
        <Typography>{`${farmer?.birthPlace?.village}`}</Typography>
      </Box>
    </Stack>

     {/* endereco */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Residência:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        <Typography>{`${farmer?.address?.province}`}</Typography>
        <Typography>{`${farmer?.address?.district}`}</Typography>
        <Typography>{`${farmer?.address?.territory}`}</Typography>
        <Typography>{`${farmer?.address?.village}`}</Typography>
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

    <Divider sx={{ mt: "10px", mb: "10px", }} />

      {/* pomares */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Número de pomares:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {`${foundFarmlands?.length}`}
      </Box>
    </Stack>

      {/* cajueiros */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%",  textAlign: 'left'}} >
        Número de cajueiros:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {`${GetTotalArea()?.totalTrees}`}
      </Box>
    </Stack>


      {/* hectares */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Área total plantada:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {`${GetTotalArea()?.actualArea}`}
      </Box>
    </Stack>


      {/* hectares */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Área total declarada:
      </Box>
      <Box sx={{width: "50%", textAlign: 'left'}}>
        {`${GetTotalArea()?.declaredArea}`}
      </Box>
    </Stack>

          {/* producao */}
    <Stack direction="row" sx={{ padding: "5px 5px 5px 5px"}} gap={2}>
      <Box sx={{ width: "50%", textAlign: 'left'}} >
        Produção anual:
      </Box>
      <Box sx={{width: "50%",  textAlign: 'left'}}>
        N/A
      </Box>
    </Stack>

     <Divider sx={{ mt: "10px", mb: "10px", }} />

    </Box>
    <Footer />
    </Box>
  )
}

export default Farmer