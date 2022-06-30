import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { addFarmer, reset } from "../../features/farmers/farmerSlice";
import Spinner from "../../components/Spinner";
import { provinces } from "../../app/provinces";
import { genders } from "../../app/genders";
import { districtsByProvince as districts } from "../../app/districts";
import { administrativePosts as adminPosts } from "../../app/administrativePosts";
import { BootstrapButton } from "../../components/Buttons";

import {
  Autocomplete,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {  DatePicker } from '@mui/x-date-pickers';
import CustomizedModal from "../../components/FarmerRegisterModal.jsx";
import FarmerRegisterModal from "../../components/FarmerRegisterModal.jsx";
import { useAddFarmerMutation } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";


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




function FarmerRegister() {

  let [farmerData, setFarmerData] = useState({
    fullname: '',
    gender: '',
    birthDate: "",
    birthPlace : {
      province: "",
      district: "",
      territory: '',
      village: '',
    },
    address: {
      territory2: '',
      village2: '',
    },
    phone: '',
  })
  
const [inputGender, setInputGender] = useState('')
const [inputBirthProvince, setInputBirthProvince] = useState('')
const [inputBirthDistrict, setInputBirthDistrict] = useState('')
const [inputBirthTerritory, setInputBirthTerritory] = useState('')
const [inputResidenceTerritory, setInputResidenceTerritory] = useState('')

const [flag, setFlag] = useState(false);

  // open and close Farmer registration Modal
  const [open, setOpen] = useState(false)
//   const [close, setClose] = useState(true)

const { fullname, gender, birthDate, birthPlace, address } = farmerData;
const { user, isloading: userIsLoading, isError: userIsError, isSuccess: userIsSuccess, } = useSelector((state)=>state.user);

const [
    addFarmer, 
    { 
        data: farmer, 
        isLoading, 
        isSuccess, 
        error, 
        isError, reset 
    } ] =  useAddFarmerMutation();


  // get user's state from redux store
  // the user's address is needed to complete the farmer's address
  // the user is not allowed to register farmers outside they district
  // const { user } = useSelector( (state) => state.auth);
  //   const { farmer, isLoading, isError, isSuccess, message } = useSelector((state)=>state.farmer)


//   console.log('user:', user)
 
  const navigate = useNavigate();
//   const dispatch = useDispatch();

    useEffect(()=>{
      if ((userIsError || !user) && !flag) {
        setFlag(true);
      }
      else {
        setFlag(false);
      }
    }, [flag, userIsError, user, userIsLoading])

  useEffect(() => {
    if (isError && error.status === 'FETCH_ERROR') {
      toast.error("Verifique a conexão da Internet", {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (isError){

      console.log('error: ', error?.error ? error.error : error); 

      toast.error(
        error && error?.status === 401 
        ? "A sua sessão expirou! Volte a fazer o login novamente!" 
        : "Algo deu errado. Tenta novamente!", {
        autoClose: 10000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
    } 
    else if (isSuccess) {
      toast.success(`Foi registado com sucesso o Produtor ${farmer.fullname.split(' ')[0]}!`, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
      // navigate("/farmers/success");
      setOpen(true)
      setFarmerData({
        fullname: '',
        gender: '',
        birthDate: "",
        birthPlace : {
          province: "",
          district: "",
          territory: '',
          village: '',
        },
        address: {
          territory2: '',
          village2: '',
        },
        phone: '',
      })
    }
    // reset();
  }, [user, farmer, isError, isSuccess, error, navigate, reset]);


  useEffect(() => {
    if ((birthPlace.province && birthPlace.district) || birthPlace.province) {
      setFarmerData((prevState)=>({
        ...prevState,
        birthPlace: { ...prevState.birthPlace, district: "", territory: "" }
      }))
    }
  }, [birthPlace.province]);

  
  useEffect(() => {
    if ((birthPlace.district && birthPlace.territory) || birthPlace.district) {
      setFarmerData((prevState)=>({
        ...prevState,
        birthPlace: { ...prevState.birthPlace,  territory: "" }
      }))
    };
  }, [birthPlace.district]);


  const onSubmit = async (e) => {
    e.preventDefault();

    if (fullname.split(" ").length < 2) {
      toast.error("Nome deve ser completo", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // create a date object for validation's purpose
    const date = new Date(birthDate);

    // validating the birth date
    if (
      !Date.parse(birthDate) || 
      !((date.getFullYear() > 1920) && (date.getFullYear() < 2010))  || 
      !(date.getMonth() < 12) ||
      !(date.getDate() <= 31)) {
        toast.error("Data de nascimento inválida!", {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      return ;
    }
    if (!gender) {
      toast.error("Selecciona o gênro do produtor!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }

    if (!birthPlace.province || !birthPlace.district || !birthPlace.territory) {
      toast.error("Completa o lugar de nascimento!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }

    if (!address.territory2) {
      toast.error("Completa o endereco!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }

    if (!user.address.province || !user.address.district) {
      toast.error("Faz o login antes de registar produtores!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return ;
    }
 

    const normalizedFarmerData = {
      ...farmerData,
      user,
      address: {
        province: user.address.province, // user's province
        district: user.address.district,  // user's district
        territory: farmerData.address.territory2,
        village: farmerData.address.village2,
      },
    }

    try {
       await addFarmer(normalizedFarmerData);
        setFarmerData({
            fullname: "",
            gender: "",
            birthDate: "",
            birthPlace: {
            province: "",
            district: "",
            territory: "",
            village: "",
            },
            address: {
            territory2: "",
            village2: "",
            },
            phone: "",
        });
    } catch (error) {
        
    }
    // dispatch(addFarmer(normalizedFarmerData));
  };

  if (isLoading || userIsLoading) {
    return <Spinner />;
  }

  return (
      <Box>
          <Navbar pageDescription={'Novo Produtor'} user={user} />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
       

      }}
    >
      <Box 
        sx={{ 
          position: "relative", 
          bottom: "80px", 
          marginTop: "140px"  
        }}  
        component="form" 
        noValidate autoComplete="off" 
        onSubmit={onSubmit}>
      <Paper
          sx={{
          maxWidth: "500px",
          height: "auto",
          textAlign: "center",
          m: "10px",
          p: "10px 0px 10px 0px",
          
          }}
      >  
        <div style={{ padding: "10px 5px 10px 5px" }}>
          <TextField
            sx={styledTextField}
            required
            fullWidth
            label="Nome completo"
            id="fullWidth fullname"
            name="fullname"
            type="text"
            placeholder="Nome completo"
            size="small"
            onChange={(event)=>{
              setFarmerData((prevState)=>({
                ...prevState,
                fullname: event.target.value
              }))
            }}
          />
        </div>

        <Stack
          direction="row"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >

          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo"
              value={gender}
              options={genders}
              onChange={(event, newGender) => {
                setFarmerData((prevState) =>({
                  ...prevState,
                  gender: newGender,
                }))
              }}
              inputValue={inputGender}
              onInputChange={(event, newInputGender) => {
                setInputGender(newInputGender)
              }}
              renderInput={(params) => {

                const inputProps = params.inputProps;
                inputProps.autoComplete = 'off';
                
                return (
                <TextField 
                  sx={styledTextField} 
                  name="gender" 
                  inputProps={inputProps}
                  {...params} 
                  required label="Gênro" 
                />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value }
            />
          </div>

          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data de Nascimento" 
                onChange={(newDate)=>{
                  setFarmerData((prevState)=>({
                    ...prevState,
                    birthDate: newDate
                  }))
                }}
                value={birthDate}
                renderInput={(params)=>(
                  <TextField {...params}
                    id="date"
                    size="small"
                    name="birthDate"
                    fullWidth 
                    sx={styledTextField}
                  />)}          
                 />
          </div>
        </Stack>
      </Paper>

      <Typography variant="body1" sx={{ fontWeight: 400, color: "gray"}}>Naturalidade</Typography>
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
          
          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo"
              value={birthPlace.province}
              options={provinces || ['']}
              onChange={(event, newProvince) => {
                setFarmerData((prevState)=>({
                  ...prevState,
                  birthPlace: { ...prevState?.birthPlace, province: newProvince }
                }))
              }}
              inputValue={inputBirthProvince}
              onInputChange={(event, newInputBirthProvince) => {
                setInputBirthProvince(newInputBirthProvince);
              }}
              renderInput={(params) => {

                const inputProps = params.inputProps;
                inputProps.autoComplete = 'off';
                
                return (
                  <TextField
                    sx={styledTextField}
                    name="province"
                    inputProps={inputProps}
                    {...params}
                    label="Província"
                    required
                    helperText="Nascimento"
                  />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value }
            />
          </div>

          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo"
              value={birthPlace?.district}
              options={
                birthPlace?.province
                  ? districts[birthPlace.province]
                  : ["Primeiro, selecciona a província!"]
              }
              onChange={(event, newDistrict) => {
                if (!Array.isArray(districts[birthPlace?.province])) {
                    toast.error("Primeiro, selecciona a província!", {
                      autoClose: 5000,
                      position: toast.POSITION.TOP_RIGHT,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                  return ;
                }
                setFarmerData((prevState)=>({
                  ...prevState,
                  birthPlace: { ...prevState.birthPlace, district: newDistrict }
                }))
              }}
              inputValue={inputBirthDistrict}
              onInputChange={(event, newInputBirthDistrict) => {
                setInputBirthDistrict(newInputBirthDistrict);
              }}
              renderInput={(params) => {

                const inputProps = params.inputProps;
                inputProps.autoComplete = 'off';
                
                return (
                  <TextField
                    sx={styledTextField}
                    name="district"
                    inputProps={inputProps}
                    {...params}
                    label="Distrito"
                    required
                    helperText="Nascimento"
                  />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value }
            />
          </div>
        </Stack>
        <Stack
          direction="row"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo"
              value={birthPlace?.territory}
              options={
                birthPlace.district
                  ? adminPosts[birthPlace?.district]
                  : ["Primeiro, selecciona o distrito"]
              }
              onChange={(event, newTerritory) => {
                if (!Array.isArray(adminPosts[birthPlace?.district]) ) {
                    toast.error("Primeiro, selecciona a província!", {
                      autoClose: 5000,
                      position: toast.POSITION.TOP_RIGHT,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                  return ;
                }
                setFarmerData((prevState)=>({
                  ...prevState,
                  birthPlace: { ...prevState.birthPlace, territory: newTerritory }
                }))
              }}
              inputValue={inputBirthTerritory}
              onInputChange={(event, newInputBirthTerritory) => {
                setInputBirthTerritory(newInputBirthTerritory);
              }}
              renderInput={(params) => {

                const inputProps = params.inputProps;
                inputProps.autoComplete = 'off';
                
                return (
                <TextField
                  sx={styledTextField}
                  name="territory"
                  inputProps={inputProps}
                  {...params}
                  label="Posto Admin"
                  helperText="Nascimento"
                />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value }
            />
          </div>
          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <TextField
              sx={styledTextField}
              fullWidth
              label="Localidade"
              id="fullWidth vaillage"
              name="village"
              type="text"
              value={birthPlace.village}
              placeholder="Localidade"
              helperText="Nascimento"
              size="small"
              onChange={(event)=>{
                setFarmerData((prevState)=>({
                  ...prevState,
                  birthPlace: { ...prevState.birthPlace, village: event.target.value }
                }))
              }}
            />
          </div>
        </Stack>
      </Paper>

       <Typography variant="body1" sx={{ fontWeight: 400, color: "gray"}}>Residência</Typography>
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
          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo"
              value={address?.territory2}
              options={
                user?.address?.district
                  ? adminPosts[user?.address?.district]
                  : ["O usuário não fez o login"]
              }
              onChange={(event, newTerritory) => {
                setFarmerData((prevState)=>({
                  ...prevState,
                  address: {...prevState.address, territory2: newTerritory}
                }));
              }}
              inputValue={inputResidenceTerritory}
              onInputChange={(event, newInputResidenceTerritory) => {
                setInputResidenceTerritory(newInputResidenceTerritory);
              }}
              renderInput={(params) => {

                const inputProps = params.inputProps;
                inputProps.autoComplete = 'off';
                
                return (
                <TextField
                  sx={styledTextField}
                  name="territory2"
                  inputProps={inputProps}
                  {...params}
                  label="Posto Admin"
                  helperText="Residência"
                />
              )}}
              isOptionEqualToValue={(option, value) =>
              value === undefined || value === "" || option === value }
            />
          </div>
          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
            <TextField
              sx={styledTextField}
              fullWidth
              label="Localidade"
              id="fullWidth village"
              name="village2"
              type="text"
              value={address.village2}
              placeholder="Localidade"
              helperText="Residência"
              size="small"
              onChange={(event)=>{
                setFarmerData((prevState)=>({
                  ...prevState,
                  address: { ...prevState.address, village2: event.target.value},
                }))
              }}
            />
          </div>
        </Stack>
          <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
              <TextField
              sx={styledTextField}
              fullWidth
              label="Telefone"
              id="fullWidth phone"
              name="phone"
              type="number"
              placeholder="Telefone"
              size="small"
              onChange={(event)=>{
                setFarmerData((prevState)=>({
                  ...prevState,
                  phone: event.target.value,
                }))
              }}
              />
          </div>
      </Paper>

        <Box sx={{ marginTop: "15px" }}>
          <BootstrapButton variant="contained" type="submit">
            Registar Produtor
          </BootstrapButton>
        </Box>

      </Box>      
    </Box>
    
    {/* Modal for successfully farmer registration! */}
    <FarmerRegisterModal open={open} setOpen={setOpen} farmer={farmer}   />



    <Footer />
    </Box>
  );
}

export default FarmerRegister;
