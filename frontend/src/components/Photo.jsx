

import { Add, AddAPhoto, AddLocation, Crop, Replay, Save } from '@mui/icons-material'
import { Avatar, Box, Divider, Fab, Grid, IconButton, Input, Stack, styled, Typography } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
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



const Photo = ({ user }) => {

  // const [imgSrc, setImgSrc] = useState('');


    // const [photo, setPhoto ] = useState();
    const [source, setSource] = useState("");
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    // const [image, setImage] = useState(null);
    // const [output, setOutput] = useState(null);
    
    
    const onImageLoad = (e)=>{
      const { naturalHeight: width, naturalHeight: heigh } = e.currentTarget;
      
      const crop = centerCrop(
        makeAspectCrop({
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height
        ),
        width,
        height
      )

      setCrop(crop);
    }

    const onCropChange = (crop, percentCrop) => setCrop(percentCrop);


    const handleCapture = (target)=>{
    
      if(target.files && target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }

    // const cropImageNow = ()=>{
    //     const canvas = document.createElement('canvas');
    //     const scaleX = image.naturalWidth / image.width;
    //     const scaleY = image.naturalHeight / image.height;
    //     canvas.width = crop.width;
    //     canvas.height = crop.height;
    //     const ctx = canvas.getContext('2d');
      
    //     const pixelRatio = window.devicePixelRatio;
    //     canvas.width = crop.width * pixelRatio;
    //     canvas.height = crop.height * pixelRatio;
    //     ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    //     ctx.imageSmoothingQuality = 'high';
      
    //     ctx.drawImage(
    //       image,
    //       crop.x * scaleX,
    //       crop.y * scaleY,
    //       crop.width * scaleX,
    //       crop.height * scaleY,
    //       0,
    //       0,
    //       crop.width,
    //       crop.height,
    //     );
          
    //     // Converting to base64
    //     const base64Image = canvas.toDataURL('image/jpeg');
    //     setOutput(base64Image);
    // }
    

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



  // const onSubmit = async (e)=>{
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("file", photo[0]);
  //   formData.append("upload_preset", "siscaju")

  //   const response = await axios.post("https://api.cloudinary.com/v1_1/musekwa/image/upload", formData);
    
  //   console.log('response:', response);

  // }
  

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
                  
                </Box>
                <ReactCrop 
                  // src={source} 
                  aspect={16 / 9}
                  crop={crop}
                  // onChange={(c)=>setCrop(c)}
                >
                  <img src={source}  onLoad={onImageLoad} style={{ maxWidth: "250px"}}  alt="snap"  />
                </ReactCrop>
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
                  {/* <IconButton onClick={cropImageNow}>
                    <Crop fontSize="large" sx={{ color: "rebeccapurple"}} />
                  </IconButton> */}
                  <IconButton>
                    <Save fontSize="large" sx={{ color: "rebeccapurple"}} />
                  </IconButton>
                  {/* <BootstrapButton sx={{ color: "#eee", minWidth: "50px"}} >
                    Salvar
                  </BootstrapButton> */}
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