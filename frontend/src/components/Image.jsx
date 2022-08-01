

import { Add, AddAPhoto, AddLocation, Crop, Replay, Save } from '@mui/icons-material'
import { Avatar, Box, Divider, Fab, Grid, IconButton, Input, Stack, styled, TextField, Typography } from '@mui/material'
import React, { Fragment, useEffect, useRef } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BootstrapButton } from './Buttons'
import axios from 'axios'
import Footer from './Footer'
import Navbar from './Navbar'
import { height, maxWidth } from '@mui/system'
// import Spinner from './Spinner'
// import { useAddCoordinatesMutation } from '../../features/api/apiSlice'
import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imgPlaceholder from '../assets/images/img_placeholder.png'
import { Image } from 'cloudinary-react';
import { useAddImageMutation } from '../features/api/apiSlice'


const UserStack = styled(Stack)(({theme})=>({
    gap: "10px",
}))

function centerAspectCrop(
  mediaWidth,
  mediaHeight,
  aspect,
){
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight,
  )
}



const ImageComponent = ({ user }) => {

    // const imgRef = useRef(null);
    const [source, setSource] = useState("");
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const [image, setImage] = useState("");
    const [isImage, setIsImage] = useState(false);

     const [
    addImage,
    { data: updatedFarmer, isLoading, isSuccess, error, isError },
  ] = useAddImageMutation()

    const location = useLocation();

    const { farmer } = location.state;

useEffect(()=>{

    if (isError && error.status === 'FETCH_ERROR') {
      toast.error("Verifique a conexão da Internet!", {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (isError){
      toast.error(error.error, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
    } 
    else if (isSuccess) {
      toast.success(`Foi adicionada a imagem com sucesso!`, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,        
      })    
      setSource("")

    }
    // reset()

  }, [updatedFarmer, isError, isSuccess, error, location])


  const handleCapture = (e)=>{

    const file =  e.target.files[0];

    if (!file.type.startsWith('image/')) return ;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = ()=>{
        setSource(reader.result)
    }
  }



const handleSubmitFile = async (e)=>{
    if (!source) return ;
    await uploadImage(source);
}

const uploadImage = async (base64EncodeImage)=>{

    const normalizedData = {
        image: base64EncodeImage,
        farmerId: farmer?._id,
    }

    await addImage(normalizedData)
   

}

  const onSubmit = async (e)=>{
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", source);
    formData.append("upload_preset", "siscaju")

    const response = await axios.post("https://api.cloudinary.com/v1_1/musekwa/image/upload", formData);
    
    console.log('response:', response);

  }

  return (
    <Box>
      <Navbar 
      arrowBack={'block'} goBack={'/'}
      pageDescription={"Imagem"} user={user} />

    <Box sx={{ 
      maxWidth: "960px", 
      padding: "10px 10px 10px 30px", 
      backgroundColor: "#343434",
      color: "#fff",
      // margin: "15px 15px 15px 10px", 
      marginTop: "60px", 
      marginBottom: "20px",               
      width: "100%", 

    //   height: "20vh",
    //   display: "flex", 
    //   justifyContent: "center", 
    //   alignItems: "center" 
      }}
    >


        <Grid container>
          <Grid item xs={4} >
            <Typography sx={{ textAlign: "left"}} variant='body1'>Produtor:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ textAlign: "left"}} variant='body1'>{`${farmer?.fullname}`} ({`${new Date().getFullYear() - new Date(farmer?.birthDate).getFullYear()}`} anos)</Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4} >
            <Typography sx={{ textAlign: "left"}} variant='body1'>Residência:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ textAlign: "left"}} variant='body1'>{farmer?.address.district} ({farmer?.address.territory})</Typography>
          </Grid>
        </Grid>

    </Box>

    <Box sx={{ 
      maxWidth: "960px", 
      padding: "10px", 
      margin: "25px 15px 25px 10px", 
      margin: "auto",                
      width: "100%",  
    //   height: "80vh",
    //   display: "flex", 
    //   justifyContent: "center", 
    //   alignItems: "center" 
      }}
    >


        <Stack direction="column" >
            <Box>
                <img src={source ? source : imgPlaceholder}   style={{ width: "250px",  }} alt="image placeholder" />
            </Box>
        </Stack>
        {/* <Stack direction="column" >
            <Box>
                <canvas id="imgCanvas" height="250px" width="250px" />
            </Box>
        </Stack> */}

        {/* <Image style={{ width: "200px"}} cloudName="musekwa" publicId="https://res.cloudinary.com/musekwa/image/upload/v1659344340/vk7awavop9a1tpy3l8ym.jpg" /> */}


        {
          source && 
          <Stack direction="column" spacing={2}> 
                <Box >
                  
                </Box>
                {/* <ReactCrop 
                  // src={source} 
                  aspect={16 / 9}
                  crop={crop}
                  // onChange={(c)=>setCrop(c)}
                >
                  <img src={source}  onLoad={onImageLoad} style={{ maxWidth: "250px"}}  alt="snap"  />
                </ReactCrop> */}
                <Stack 
                  direction="row" 
                  alignItems="center"
                  justifyContent="center"
                  spacing={3}
                >
                  <IconButton onClick={()=>{
                    setSource("")
                    
                  }}>
                    <Replay fontSize="large" sx={{ color: "rebeccapurple"}} />
                  </IconButton>
                  <IconButton >
                    <Crop fontSize="large" sx={{ color: "rebeccapurple"}} />
                  </IconButton>
                  <IconButton 
                    //   onClick={onSubmit}
                    onClick={handleSubmitFile}
                  >
                    <Save fontSize="large" sx={{ color: "rebeccapurple"}} />
                  </IconButton>
                  {/* <BootstrapButton sx={{ color: "#eee", minWidth: "50px"}} >
                    Salvar
                  </BootstrapButton> */}
                </Stack>
          </Stack>
        }

        {
         !source
          && 
          <Box sx={{ marginTop: "20px" }}>
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
                onChange={(e) =>handleCapture(e)} 
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
            </Box>
        }
    </Box>
    <Footer />
  </Box>
  )
}

export default ImageComponent