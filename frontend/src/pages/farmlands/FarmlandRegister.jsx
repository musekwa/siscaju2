
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
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import FarmlandRegisterModal from '../../components/FarmlandRegisterModal'
import { useAddFarmlandMutation } from '../../features/api/apiSlice'


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


const FarmlandRegister = ({ user }) => {

  // collecting all data from the this farmland form
  const [farmlandData, setFarmlandData] = useState({
    label: '',
    declaredArea: '',
    interCrops: [],
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
          label, 
          declaredArea, 
          interCrops, 
          trees, 
          sowingYear, 
          plantedArea, 
          spacing, 
          plantingTechniques } = farmlandData;

  const navigate = useNavigate()
  const location = useLocation()

  // get the farmer from the FarmlandAdd component route location (state)
   let farmer = location.state?.farmer;

  const [
    addFarmland,
    { data: farmland, isLoading, isSuccess, error, isError },
  ] = useAddFarmlandMutation();

 
  if (!farmer || !user){
    navigate('/')
    // return ;
  }


  useEffect(()=>{

    if (isError){
      toast.error(error, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,        
      })
    }
    else if (isSuccess) {
      toast.success(`Foi registado com sucesso o pomar ${label} de ${farmer.fullname}!`, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,        
      })     
      setOpen(true)
      setFarmlandData({
        label: '',
        declaredArea: '',
        interCrops: [],
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

  }, [farmland, isError, isSuccess, error, farmer, label, navigate])



  const onSubmit = async (e)=>{
    e.preventDefault();

    // input data validation
    if (!declaredArea) {
      toast.error('Área da percela em hectares',{
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


    if (!label) {
      toast.error('Localização geográfica deste pomar',{
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

    if (!(sowingYear > 1900 && sowingYear <= new Date().getFullYear())) {
      console.log('sowing year: ', sowingYear)
      toast.error('Ano de plantio tem de ser válido!', {
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

    if (
        typeof trees === 'undefined' 
        || typeof declaredArea === 'undefined'
        || typeof plantedArea === 'undefined') {
      console.log('trees', typeof trees)
      console.log('declared', typeof declaredArea)
      console.log('planted', typeof plantedArea)
      console.log(typeof trees)
      toast.error('Completa dados em falta!', {
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


    const normalizedFarmlandData = {
      label,
      interCrops,
      declaredArea,
      divisions: [
        {
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
          }
        }
      ],
      // sending the farmerId to be used as a query param in the URL (backend)
      farmerId: farmer._id
    }
    // pass the farmerId as query param to be attached to the URL
    // dispatch(farmlandRegister(normalizedFarmlandData))
     if (!isLoading) {
         try {
             await addFarmland(normalizedFarmlandData);
         } catch (error) {
             
         }
     }
  }

  if (isLoading) {
    return (
      <Spinner />
    )
  }

  return (
    <Box>
      <Navbar pageDescription={"Novo Pomar"} user={user} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "60px",
        }}
      >
        {/* Start Farmer's Profile */}
        <UserStack direction="row" onClick={() => true} sx={{ m: "10px" }}>
          <Avatar sx={{ width: "50px", height: "50px" }} src="" />
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body1">{`${farmer?.fullname}`}</Typography>
            <Typography variant="body2">({`${farmer?.category}`})</Typography>
          </Box>
        </UserStack>
      </Box>

      {/* End Farmer's Profile & Start Farmland Registration form */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Farmalnd form */}
        <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
          <Paper
            sx={{
              maxWidth: "500px",
              height: "auto",
              textAlign: "center",
              m: "5px",
            }}
          >
            {/* Farmland label and declared area */}
            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box component="div" sx={{ padding: "10px 10px 10px 10px" }}>
                <TextField
                  sx={styledTextField}
                  fullWidth
                  label="Área declarada"
                  id="fullWidth "
                  value={farmlandData.declaredArea}
                  name="declaredArea"
                  type="number"
                  placeholder="Área (hectares)"
                  size="small"
                  onChange={(event) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      declaredArea: event.target.value,
                    }));
                  }}
                />
              </Box>

              <Box component="div" sx={{ padding: "10px 10px 10px 10px" }}>
                <TextField
                  sx={styledTextField}
                  required
                  fullWidth
                  label="Localização geográfica "
                  id="fullWidth"
                  value={farmlandData.label}
                  name="label"
                  type="text"
                  placeholder="Localização geográfica "
                  size="small"
                  onChange={(event) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      label: event.target.value,
                    }));
                  }}
                />
              </Box>
            </Stack>

            {/* Farmland interCrops */}
            <Stack direction="row">
              <Box
                component="div"
                sx={{ width: "100%", padding: "10px 10px 10px 10px" }}
              >
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={interCropsList}
                  getOptionLabel={(crop) => crop}
                  defaultValue={[]}
                  filterSelectedOptions
                  onChange={(event, newCrops) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      interCrops: newCrops,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Culturas consorciadas"
                      placeholder="Selecciona culturas"
                      size="small"
                      sx={styledTextField}
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option === value
                  }
                />
              </Box>
            </Stack>
          </Paper>

          <Stack direction="row" sx={{ padding: "10px 10px 5px 10px" }}>
            <Typography variant="body2">
              Registar divisões deste pomar segundo os anos de plantio dos seus
              cajueiros.
            </Typography>
          </Stack>

          {/* Start Division */}

          <Paper
            sx={{
              maxWidth: "500px",
              height: "auto",
              textAlign: "center",
              margin: "10px 5px 5px 5px",
              pt: "5px",
            }}
          >
            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box component="div" sx={{ padding: "10px 10px 10px 10px" }}>
                <TextField
                  sx={styledTextField}
                  required
                  fullWidth
                  label="Ano de plantio"
                  id="fullWidth"
                  value={farmlandData.sowingYear}
                  name="sowingYear"
                  type="number"
                  placeholder="Ano de plantio"
                  size="small"
                  onChange={(event) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      sowingYear: event.target.value,
                    }));
                  }}
                />
              </Box>
              <Box component="div" sx={{ padding: "10px 10px 10px 10px" }}>
                <TextField
                  sx={styledTextField}
                  required
                  fullWidth
                  label="Número de cajueiros"
                  id="fullWidth"
                  value={farmlandData.trees}
                  name="trees"
                  type="number"
                  placeholder="Número de cajueiros"
                  size="small"
                  onChange={(event) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      trees: event.target.value,
                    }));
                  }}
                />
              </Box>
            </Stack>

            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box
                component="div"
                sx={{ width: "50%", padding: "10px 10px 10px 10px" }}
              >
                <TextField
                  sx={styledTextField}
                  fullWidth
                  label="Área plantada"
                  id="fullWidth"
                  value={farmlandData.plantedArea}
                  name="plantedArea"
                  type="number"
                  placeholder="Área (hectares)"
                  size="small"
                  onChange={(event) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      plantedArea: event.target.value,
                    }));
                  }}
                />
              </Box>
              <Stack
                direction="row"
                sx={{
                  width: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  component="div"
                  sx={{ width: "45%", padding: "10px 2px 10px 10px" }}
                >
                  <TextField
                    sx={styledTextField}
                    fullWidth
                    label="Compasso"
                    id="fullWidth"
                    value={farmlandData?.spacing.x}
                    name="x"
                    type="number"
                    placeholder=""
                    size="small"
                    onChange={(event) => {
                      setFarmlandData((prevState) => ({
                        ...prevState,
                        spacing: {
                          ...prevState.spacing,
                          x: event.target.value,
                        },
                      }));
                    }}
                  />
                </Box>
                <Typography variant="body2">por</Typography>
                <Box
                  component="div"
                  sx={{ width: "45%", padding: "10px 10px 10px 2px" }}
                >
                  <TextField
                    sx={styledTextField}
                    fullWidth
                    label="Compasso"
                    id="fullWidth"
                    value={farmlandData.spacing.y}
                    name="y"
                    type="number"
                    placeholder=""
                    size="small"
                    onChange={(event) => {
                      setFarmlandData((prevState) => ({
                        ...prevState,
                        spacing: {
                          ...prevState.spacing,
                          y: event.target.value,
                        },
                      }));
                    }}
                  />
                </Box>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box
                component="div"
                sx={{ width: "50%", padding: "10px 10px 10px 10px" }}
              >
                <Autocomplete
                  fullWidth
                  required
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={plantingTechniquesList}
                  onChange={(event, newSeedling) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      plantingTechniques: {
                        ...prevState.plantingTechniques,
                        seedling: newSeedling,
                      },
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
                      value={farmlandData?.plantingTechniques.seedling}
                      {...params}
                      label="Tipo de plantios"
                    />
                  )}
                />
              </Box>
            </Stack>
            {farmlandData.plantingTechniques.seedling === "enxertia" ? (
              <Box
                component="div"
                sx={{ width: "100%", padding: "10px 10px 10px 10px" }}
              >
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={clones}
                  getOptionLabel={(clone) => clone}
                  defaultValue={[]}
                  filterSelectedOptions
                  onChange={(event, newClone) => {
                    setFarmlandData((prevState) => ({
                      ...prevState,
                      plantingTechniques: {
                        ...prevState.plantingTechniques,
                        grafting: newClone,
                      },
                    }));
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
            ) : null}
          </Paper>

          <Paper
            sx={{
              maxWidth: "500px",
              height: "auto",
              textAlign: "center",
              margin: "10px 5px 5px 5px",
              pt: "5px",
            }}
          >
            <BootstrapButton
              sx={{ width: "100%" }}
              variant="contained"
              type="submit"
              startIcon={<Save />}
            >
              Salvar Pomar
            </BootstrapButton>
          </Paper>
        </Box>
        {/* End Farmland registration form */}
      </Box>
      {/* Modal for the successfully farmland registration */}
      <FarmlandRegisterModal
        open={open}
        setOpen={setOpen}
        farmer={farmer}
        farmland={farmland}
      />
      <Footer />
    </Box>
  );
}

export default FarmlandRegister