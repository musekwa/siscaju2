
import { Autocomplete, Avatar, Box, Paper, Stack, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { interCropsList } from '../../app/interCropsList'
import { plantingTechniquesList } from '../../app/plantingTechniquesList'
import { clones } from '../../app/clones'
import Navbar from '../../components/Navbar'
import Spinner from '../../components/Spinner'
import { BootstrapButton } from "../../components/Buttons";
import { Save } from '@mui/icons-material'
import Footer from '../../components/Footer'
// import { useSelector, useDispatch } from 'react-redux'
// import { farmlandDivisionRegister, reset } from '../../features/farmlandDivisions/farmlandDivisionSlice'
import { toast } from 'react-toastify'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import FarmlandRegisterModal from '../../components/FarmlandRegisterModal'
import { useAddDivisionMutation } from '../../features/api/apiSlice'


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
}))


const FarmlandDivisionRegister = ({ user }) => {

  // collecting all data from the this farmland form
  const [divisionData, setDivisionData] = useState({
    trees: '',
    sowingYear: '',
    plantedArea: '',
    spacing: {
      x: '',
      y: ''
    },
    plantingTechniques: {
      seedling: "",
      grafting: []
    }
  })

  // open and close the successfully farmland registration modal
  const [open, setOpen] = useState(false)

  const [inputSeedling, setInputSeedling] = useState('')
  const { 
          trees, 
          sowingYear, 
          plantedArea, 
          spacing, 
          plantingTechniques } = divisionData;

//   const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation();

  const { farmer, farmland } = location.state;

  const [
    addDivision,
    { data: division, isLoading, isSuccess, error, isError, reset },
  ] = useAddDivisionMutation();

  // const { farmer: farmerFromState, farmland: farmlandFromState } = location.state;
  // console.log('farmer: ', farmerFromState)
  // console.log('farmland: ', farmlandFromState)

  // const { user } = useSelector((state)=>state.auth)
//   const { farmer, isLoading: isFarmerLoading, isError: isFarmerError, isSuccess: isFarmerSuccess, message: farmerMessage } = useSelector((state)=>state.farmer)
//   const { farmland, isLoading: isFarmlandLoading, isError: isFarmlandError, isSuccess: isFarmlandSuccess, message: farmlandMessage } = useSelector((state)=>state.farmland)
//   const { farmlandDivision, isError, isSuccess, isLoading, message } = useSelector((state)=>state.farmlandDivision)


  // useEffect(()=>{
  //   setTimeout(2000);
  // }, [])


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
      toast.success('Registado uma divisão com sucesso!', {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,        
      });

      setOpen(true)
      setDivisionData({
        trees: '',
        sowingYear: '',
        plantedArea: '',
        spacing: {
          x: '',
          y: ''
        },
        plantingTechniques: {
          seedling: "",
          grafting: []
        }
      })

    }
    // reset()

  }, [division, isError, isSuccess, navigate, error])

  useEffect(()=>{
    if (!user || !farmland || !farmer) {
      navigate('/')
    }
  }, [user, farmland, farmer])



  const onSubmit = async (e)=>{
    e.preventDefault();

    // input data validation
    if (!(sowingYear > 1900 && sowingYear <= new Date().getFullYear())) {
      toast.error('Ano de plantio tem de ser válido!',{
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }


    if (!plantedArea || isNaN(plantedArea)) {
      toast.error('Área plantada tem de ser válido',{
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }

    if (!trees || isNaN(trees)) {
      toast.error('Número de cajueiros tem de ser válido',{
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }


   const normalizedDivisionData = {
      trees,
      sowingYear,
      plantedArea,
      spacing: {
        x: spacing?.x,
        y: spacing?.y,
      },
      plantingTechniques: {
        seedling: plantingTechniques.seedling,
        grafting: plantingTechniques.seedling === 'enxertia' ? plantingTechniques.grafting : null
      },
      // sending the farmerId to be used as a query param in the URL (backend)
      farmlandId: farmland._id
    }
    // pass the farmerId as query param to be attached to the URL
    // dispatch(farmlandDivisionRegister(normalizedDivisionData))
    try {
        await addDivision(normalizedDivisionData);
        setDivisionData({
            trees: "",
            sowingYear: "",
            plantedArea: "",
            spacing: {
                x: "",
                y: "",
            },
            plantingTechniques: {
                seedling: "",
                grafting: [],
            },
        });

    } catch (error) {
        
    }
  }

  if (isLoading) {
    return (
      <Spinner />
    )
  }

  return (
    <Box>
      <Navbar pageDescription={'Novo Pomar'} user={user} />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "45px"
      }}
    >

      {/* Start Farmer's Profile */}
      <UserStack direction="row" onClick={()=>(true)} sx={{ m: "10px", }}>
        <Avatar sx={{ width: "50px", height: "50px"}} src="" />
        <Box sx={{ textAlign: "left" }}>
            <Typography variant='body1'>{`${farmer?.fullname}`}</Typography>
            <Typography variant='body2'>({`${farmer?.category}`})</Typography>
        </Box>
      </UserStack>
    </Box>

    {/* End Farmer's Profile & Start Farmland Registration form */}

      <Box sx={{
        // display: "flex",
        // justifyContent: "center",
        width: "100%",
      }}>

        <Box sx={{
          maxWidth: "500px",
          height: "auto",
          textAlign: "center",
          m: "5px",
          }}
        >
          <Stack direction="column" sx={{ padding: "10px 10px 5px 10px" }} gap={2}>
            <Typography variant='body2'>
              Pomar localizado: <span style={{ color: "rebeccapurple"}}>{`${farmland?.label}`}</span>
            </Typography>

            <Typography variant="body2">
                Registar outra divisão deste pomar segundo o 
                ano de plantio dos seus cajueiros.
            </Typography>
        
          </Stack>
          </Box>


        {/* Farmalnd form */}
        <Box sx={{ position: "relative", bottom: "80px", marginTop: "100px"  }} component="form" noValidate autoComplete='off' onSubmit={onSubmit} >
           {/* Start Division */}

            <Paper
              sx={{
              maxWidth: "500px",
              height: "auto",
              textAlign: "center",
              m: "10px",
              p: "10px 0px 10px 0px",
              }}
            > 
              <Stack
                direction="row"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box component="div" sx={{ width: "49%", padding: "10px 5px 10px 5px" }}>
                  <TextField
                      sx={styledTextField}
                      required
                      fullWidth
                      label="Ano de plantio"
                      id="fullWidth"
                      value={divisionData.sowingYear}
                      name="sowingYear"
                      type="number"
                      placeholder="Ano de plantio"
                      size="small"
                      onChange={(event)=>{
                        setDivisionData((prevState)=>({
                          ...prevState,
                          sowingYear: event.target.value
                        }))
                      }}
                    />
                </Box>
                <Box component="div" sx={{ width: "49%", padding: "10px 5px 10px 5px" }}>
                  <TextField
                      sx={styledTextField}
                      required
                      fullWidth
                      label="Número de cajueiros"
                      id="fullWidth"
                      value={divisionData.trees}
                      name="trees"
                      type="number"
                      placeholder="Número de cajueiros"
                      size="small"
                      onChange={(event)=>{
                        setDivisionData((prevState)=>({
                          ...prevState,
                          trees: event.target.value
                        }))
                      }}
                  />
                </Box>             
                </Stack>

                <Stack
                    direction="row"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Box component="div" sx={{ width: "49%", padding: "10px 5px 10px 5px" }}>
                      <TextField
                      sx={styledTextField}
                      fullWidth
                      label="Área plantada"
                      id="fullWidth"
                      value={divisionData.plantedArea}
                      name="plantedArea"
                      type="number"
                      placeholder="Área (hectares)"
                      size="small"
                      onChange={(event)=>{
                        setDivisionData((prevState)=>({
                          ...prevState,
                          plantedArea: event.target.value
                        }))
                      }}
                      />
                    </Box>
                  <Stack
                    direction="row"
                    sx={{ width: "49%", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Box component="div" sx={{ width: "49%", padding: "10px 1px 10px 5px" }}>
                    <TextField
                        sx={styledTextField}
                        fullWidth
                        label="Compasso"
                        id="fullWidth"
                        value={divisionData?.spacing.x}
                        name="x"
                        type="number"
                        placeholder=""
                        size="small"
                        onChange={(event)=>{
                          setDivisionData((prevState)=>({
                            ...prevState,
                            spacing: {...prevState.spacing, x: event.target.value }
                          }))
                        }}
                    />
                    </Box>
                    <Typography variant="h5" sx={{ color: "gray" }}>x</Typography>
                    <Box component="div" sx={{ width: "49%", padding: "10px 5px 10px 1px" }}>
                        <TextField
                            sx={styledTextField}
                            fullWidth
                            label="Compasso"
                            id="fullWidth"
                            value={divisionData.spacing.y}
                            name="y"
                            type="number"
                            placeholder=""
                            size="small"
                            onChange={(event)=>{
                              setDivisionData((prevState)=>({
                                ...prevState,
                                    spacing: {...prevState.spacing, y: event.target.value }
                              }))
                            }}
                        />
                    </Box>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >

                  <Box component="div" sx={{ width: "100%", padding: "10px 5px 10px 5px" }}>
                    <Autocomplete
                      fullWidth
                      required
                      size="small"
                      disablePortal
                      id="combo-box-demo"
                      options={plantingTechniquesList}
                      onChange={(event, newSeedling) => {
                        setDivisionData((prevState)=>({
                          ...prevState,
                          plantingTechniques: { ...prevState.plantingTechniques, seedling: newSeedling }
                        }));
                      }}
                      inputValue={inputSeedling}
                      onInputChange={(event, newInputSeedling) => {
                        setInputSeedling(newInputSeedling);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={styledTextField}
                          name="seedling"
                          value={divisionData?.plantingTechniques.seedling}
                          {...params}
                          label="Tipo de plantios"
                        />
                      )}
                    />
                  </Box>
                </Stack>
              {
                divisionData.plantingTechniques.seedling === 'mudas enxertadas' 
                ? (
            
                <Box component="div" sx={{ width: "100%", padding: "10px 10px 10px 10px" }}>
                  <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={clones}
                      getOptionLabel={(clone) => clone}
                      defaultValue={[]}
                      filterSelectedOptions
                      onChange={(event, newClone) => {
                        setDivisionData((prevState) =>({
                          ...prevState,
                          plantingTechniques: { ...prevState.plantingTechniques, grafting: newClone },
                        }))
                      }}
                      renderInput={(params) => (
                      <TextField
                          {...params}
                          label="Tipos de clones"
                          size="small"
                          placeholder="Selecciona clone"
                          sx={styledTextField}
                      />
                      )}
                  />
                </Box> 
                )
                : null
          }
          </Paper>     

          <Box sx={{ marginTop: "15px" }}>
          <BootstrapButton 
            variant="contained" 
            type="submit" startIcon={<Save />}
          >
            Salvar Divisão 
          </BootstrapButton>
          </Box>
        </Box>
         {/* End Farmland registration form */}
      </Box>
            {/* Modal for the successfully farmland registration */}
            <FarmlandRegisterModal open={open} setOpen={setOpen} farmer={farmer} farmland={farmland} farmlandDivision={division} />
      <Footer />
    </Box>
  )
}

export default FarmlandDivisionRegister