

import { Add, AddAPhoto, AddLocation, Replay } from '@mui/icons-material'
import { Avatar, Box, Divider, Fab, Grid, IconButton, Input, Stack, styled, Typography } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BootstrapButton } from './Buttons'
import axios from 'axios'
import Footer from './Footer'
import Navbar from './Navbar'
import { maxWidth } from '@mui/system'
// import Spinner from './Spinner'
// import { useAddCoordinatesMutation } from '../../features/api/apiSlice'

const UserStack = styled(Stack)(({theme})=>({
    gap: "10px",
}))

const Photo = ({ user }) => {

    const [photo, setPhoto ] = useState();
    const [source, setSource] = useState("");

    // const [open, setOpen] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();

    //  const { farmer, farmland } = location.state;



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

  }
  
  const handleCapture = (target)=>{

    if(target.files && target.files.length !== 0) {
      const file = target.files[0];
      const newUrl = URL.createObjectURL(file);
      setSource(newUrl);
    }
  }

  console.log('source: ', source)

//   if (isLoading) {
//     return (
//       <Spinner />
//     )
//   }


  return (
    <Box>
      <Navbar 
      arrowBack={'block'} goBack={'/'}
      pageDescription={"Imagem"} user={user} />
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "60px",
        }}
      >
      </Box> */}

    <Box sx={{ 
      maxWidth: "960px", 
      padding: "10px", 
      // margin: "15px 15px 15px 10px", 
      margin: "auto",                
      width: "100%",  
      height: "80vh",
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
      }}
    >


        {
          source && 
          <Stack direction="column" spacing={2}> 
                <Box >
                  <img src={source} style={{ maxWidth: "250px"}}  alt="snap"  />
                </Box>
                <Stack 
                  direction="row" 
                  alignItems="center"
                  justifyContent="center"
                  spacing={9}
                >
                  <IconButton onClick={()=>{
                    setSource("")
                  }}>
                    <Replay fontSize="large" sx={{ color: "rebeccapurple"}} />
                  </IconButton>
                  <BootstrapButton sx={{ color: "#eee", minWidth: "50px"}} >
                    Salvar
                  </BootstrapButton>
                </Stack>
          </Stack>
        }

      {/* <GrStid container> */}
        {
          !source 
          && 
          <Box>
                <label htmlFor="add-photo">
                  <input
                    style={{ display: 'none' }}
                    id="add-photo"
                    name="add-photo"
                    type="file"
                    
                    // accept="image/x-png, image/jpeg, image/gif" 
                    accept="image/*"
                    capture="environment"
                    onChange={(event)=>{ 
                      handleCapture(event.target);
                    }} 
                    />

                    <AddAPhoto 
                      sx={{ 
                        fontSize: "50px", 
                        color: "rebeccapurple"
                      }} 
                      /> 
                    
                </label>
                <Typography sx={{ fontSize: "12px", color: "gray"}}>Capturar imagem</Typography>
            </Box>
        }



    </Box>
    <Footer />
  </Box>
  )
}

export default Photo