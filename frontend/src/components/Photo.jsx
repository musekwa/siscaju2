

import { AddAPhoto, AddLocation } from '@mui/icons-material'
import { Avatar, Box, Divider, Grid, Input, Stack, styled, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BootstrapButton } from './Buttons'
import axios from 'axios'
// import FarmlandRegisterModal from '../../components/FarmlandRegisterModal'
// import Footer from '../../components/Footer'
// import Navbar from '../../components/Navbar'
// import Spinner from '../../components/Spinner'
// import { useAddCoordinatesMutation } from '../../features/api/apiSlice'

const UserStack = styled(Stack)(({theme})=>({
    gap: "10px",
}))

const Photo = () => {

    const [photo, setPhoto ] = useState()

    // const [open, setOpen] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();

    //  const { farmer, farmland } = location.state;

//     const [ addCoordinates, 
//         {
//             data: updatedFarmland, isLoading, isSuccess, error, isError, reset },
//   ] = useAddCoordinatesMutation();


  useEffect(()=>{

    //     if (!navigator.geolocation) {
    //   setCoordinates(prevState=>({
    //     ...prevState,
    //     status: 'Este navegador não suporta a geolocalização',
    //   }));
    // }
    // else {
    //     setCoordinates(prevState=>({
    //     ...prevState,
    //     status: 'Localizando...',
    //   }));
    //   navigator.geolocation.getCurrentPosition((position)=>{
    //     setCoordinates(prevState=>({
    //         ...prevState,
    //         status: null,
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //     }))
    //   }, ()=>{
    //     setCoordinates(prevState=>({
    //     ...prevState,
    //     status: 'Não foi possível capturar a geolocalização',
    //   }));
    //   })
    // }

    // if (isError && error.status === 'FETCH_ERROR') {
    //   toast.error("Verifique a conexão da Internet!", {
    //     autoClose: 5000,
    //     hideProgressBar: true,
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else if (isError){
    //   toast.error(error.error, {
    //     autoClose: 5000,
    //     hideProgressBar: true,
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } 
    // else if (isSuccess) {
    //   toast.success('Capturadas as coordenadas com sucesso!', {
    //     autoClose: 5000,
    //     hideProgressBar: true,
    //     position: toast.POSITION.TOP_CENTER,        
    //   });

    //   setOpen(true)
    //   setCoordinates({
    //     latitude: null,
    //     longitude: null,
    //     status: null,
    //     })

    // }
    // reset()

  }, [
    // updatedFarmland, 
    // isError, 
    // isSuccess, 
    // navigate, 
    // error
])

  useEffect(()=>{
    // if (!user || !farmland || !farmer) {
    //   navigate('/')
    // }
  }, [
    // user, 
    // farmland, 
    // farmer
])

const uploadImage = async (files) =>{



}

  const onSubmit = async (e)=>{
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", photo[0]);
    formData.append("upload_preset", "siscaju")

    const response = await axios.post("https://api.cloudinary.com/v1_1/musekwa/image/upload", formData);
    
    console.log('response:', response);

    //   try {
    //     if (coordinates?.latitude && coordinates?.longitude) {
    //       const normalizedCoordinatesData = {
    //         farmlandId: farmland._id,
    //         geocoordinates: {
    //           latitude: coordinates.latitude,
    //           longitude: coordinates.longitude,
    //         }
    //       }
    //       await addCoordinates(normalizedCoordinatesData)
    //     }
    //   } catch (error) {
        
    //   }
    }
  


//   if (isLoading) {
//     return (
//       <Spinner />
//     )
//   }


  return (
    <Box>
      {/* <Navbar pageDescription={"Novo Pomar"} user={user} /> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "60px",
        }}
      >
        {/* Start Farmer's Profile */}
        {/* <UserStack direction="row" onClick={() => true} sx={{ m: "10px" }}>
          <Avatar sx={{ width: "50px", height: "50px" }} src="" />
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body1">{`${farmer?.fullname}`}</Typography>
            <Typography variant="body2">({`${farmer?.category}`})</Typography>
          </Box>
        </UserStack> */}
      </Box>

      {/* End Farmer's Profile & Start Farmland Registration form */}

    <Box sx={{ maxWidth: "960px", padding: "10px", margin: "15px 15px 15px 10px" }}>

    {/* dados do pomar */}
        {/* <Stack direction="row" sx={{ padding: "1px 5px 2px 5px"}} gap={2}>
        <Box sx={{ width: "50%",textAlign: 'left'}} >
            {farmer?.village ? 'Localidade (Designação):' : 'Designação:' }
        </Box>
        <Box sx={{width: "50%", textAlign: 'left'}}>
            {farmer?.village ?  `${farmer?.address?.village} (${farmland?.label}):` : `${farmland?.label}`}
        </Box>
        </Stack> */}

        {/* Dados Immutaveis do pomar  */}
        {/* <Stack direction="row" sx={{ padding: "1px 5px 2px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
                Distrito (posto):
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
                <Typography>{`${farmland?.district} (${farmland?.territory ? farmland?.territory : 'N/A' })` }</Typography>
            </Box>
        </Stack> */}

        {/* <Stack direction="row" sx={{ padding: "1px 5px 2px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
                Latitude:
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
                <Typography>{`${coordinates?.latitude}` }</Typography>
            </Box>
        </Stack>
        <Stack direction="row" sx={{ padding: "1px 5px 2px 5px"}} gap={2}>
            <Box sx={{ width: "50%", textAlign: 'left'}} >
                Longitude:
            </Box>
            <Box sx={{width: "50%", textAlign: 'left'}}>
                <Typography>{`${coordinates?.longitude}` }</Typography>
            </Box>
        </Stack> */}
     </Box>

     {/* <Divider /> */}

        <Box 
            sx={{ 
                width: "100%",  
                height: "50vh",
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center" }}
        >
            <Box 
        // sx={{ 
        //   position: "relative", 
        //   bottom: "80px", 
        //   marginTop: "140px"  
        // }}  
                component="form" 
                noValidate autoComplete="off" 
                onSubmit={onSubmit}>

                <Input 

                    type="file" 
                    accept="image/x-png, image/jpeg, image/gif" 
                    onChange={(event)=>{
                        setPhoto(event.target.files);
                    }} 
                />
                
                <BootstrapButton   
                        type='submit'            
                        variant="contained"
                        sx={{ maxWidth: "300px"}}
                        startIcon={<AddAPhoto fontSize="large"  />} 
                        // onClick={()=>{
                        //     ();
                        //     // setOpen(true)
                        // }}
                    >
                    Capturar foto
                </BootstrapButton>
            </Box>
        </Box>
         {/* <FarmlandRegisterModal open={open} setOpen={setOpen} farmer={farmer} farmland={farmland} /> */}
    {/* <Footer /> */}
    </Box>
  )
}

export default Photo