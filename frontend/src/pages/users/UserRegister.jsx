import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { register, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";
import { roles } from "../../app/roles";
import { provinces } from "../../app/provinces";
import { genders } from "../../app/genders";
import { districtsByProvince as districts } from "../../app/districts";
import { administrativePosts as adminPosts } from "../../app/administrativePosts";
import { BootstrapButton } from "../../components/Buttons";
// import { useRegisterMutation } from "../../features/auth/userSlice";
// import { useRegisterMutation } from "../../features/api/apiSlice";

import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, register, resetUser } from "../../features/users/userSlice"
import Navbar from "../../components/Navbar";



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




function UserRegister() {
  
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    password2: "",
    gender: "",
    role: "",
    phone: "",
    address: {
      province: "",
      district: "",
      territory: ""
    },
    showPassword: false,
    showPassword2: false,
  });

  // const [province, setProvince] = useState("");
  // const [district, setDistrict] = useState("");
  const [territory, setTerritory] = useState("");
  const [inputRole, setInputRole] = useState("");
  const [inputProvince, setInputProvince] = useState("");
  const [inputDistrict, setInputDistrict] = useState("");
  const [inputGender, setInputGender] = useState("");
  const [inputTerritory, setInputTerritory] = useState("");
 
  const { fullname, email, password, password2, gender, role, phone, address } = userData;

  // const [register, { data: user, isLoading, isSuccess, error, isError, reset }] = useRegisterMutation();

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  const handleClickShowPassword = () => {
    setUserData(prevState=>({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleClickShowPassword2 = () => {
    setUserData(prevState=>({
      ...prevState,
      showPassword2: !prevState.showPassword2,
    }));
  };


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  useEffect(()=>{

  }, [user])



  useEffect(() => {
    if (isSuccess && user && JSON.stringify(user)?.includes('timed out after')) {
        toast.error(`Verifique a conexão da Internet!`, {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        });
        localStorage.removeItem('user');
        dispatch(resetUser());
        return ;
    } 
    else if (isSuccess) {
      toast.success(
        `Olá ${user?.fullname?.split(" ")[0]}, Bem-vindo a SisCaju!`,
        {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
      navigate("/", { state: { user } });
      setUserData({
        fullname: "",
        email: "",
        password: "",
        password2: "",
        gender: "",
        role: "",
        phone: "",
        address: {
          province: "",
          district: "",
          territory: "",
        },
      });
    }
    else if (isError && message === 'Network Error') {
      toast.error("Verifique a conexão da Internet!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    else if (isError && message?.includes('status code 400')) {
      toast.error("Credenciais inválidas!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    else if (isError && message?.includes('status code 409')) {
      toast.error("Este utilizador já foi registado!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
      navigate('/signin');
      return ;
    }
    else if (isError) {
      toast.error(message ? message : "O registo falhou!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, register, dispatch]);

  useEffect(() => {
    if ((address.province && address.district) || address.province) {
      setUserData((prevState)=>({
        ...prevState,
        address: { ...prevState.address, district: "", territory: "" }
      }))
    }
  }, [address.province]);

  useEffect(() => {
    if ((address.district && address.territory) || address.district) {
      setUserData((prevState)=>({
        ...prevState,
        address: { ...prevState.address, territory: "" }
      }))
    }
  }, [address.district]);

  // if (isSuccess) {
  //   window.location.reload(false)
  //    return <Navigate to={'/'} replace />
  // }

  // validating email
  const validateEmail = (email) => {
    const pattern =
      /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(email);
    if (result === false) {
      // if the email is invalid
      return true;
    }
    // if the email is valid
    return false;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if ((fullname?.split(" ").length < 2) || !fullname?.trim())  {
      toast.error("Nome deve ser completo", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (validateEmail(email)) {
      toast.error("Email inválido", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if ((password !== password2) || !password || !password2) {
      toast.error("Passwords não correspondem", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    

    if (!(roles.indexOf(role) > -1)) {
      toast.error("Perfil inválido", {
        autoClose: 5000,
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!address.province || !address.district) {

        toast.error("Endereço incompleto!", {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });

      return ;
    }

    const normalizedUserData = {
      ...userData,
    };

    if (!isLoading) {
      dispatch(register(normalizedUserData));
    }
    
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Navbar
        arrowBack={"block"}
        goBack={"/signin"}
        pageDescription={"Registo de utilizador"}
      />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      {/* {isLoading && <Spinner />} */}
      {/* {(isError || error) && <Box sx={{ width: "200px", height: "40px"}}> Algo deu errado!</Box>} */}
      <Box
        sx={{
          maxWidth: "500px",
          height: "auto",
          textAlign: "center",
          mt: "2rem",
          mb: "40px",
        }}
      >
       <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
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
              size="medium"
              value={userData.fullname}
              onChange={(event) => {
                setUserData((prevState) => ({
                  ...prevState,
                  fullname: event.target.value,
                }));
              }}
            />
          </div>
          <div style={{ padding: "10px 5px 10px 5px" }}>
            <TextField
              sx={styledTextField}
              required
              fullWidth
              label="Email"
              id="fullWidth email"
              name="email"
              type="email"
              placeholder="Email"
              size="medium"
              value={userData.email}
              onChange={(event) => {
                setUserData((prevState) => ({
                  ...prevState,
                  email: event.target.value.toLowerCase(),
                }));
              }}
            />
          </div>
          <div style={{ padding: "10px 5px 10px 5px" }}>

            <TextField
              sx={styledTextField}
              required
              fullWidth
              label="Password"
              id="fullWidth password"
              name="password"
              type={userData.showPassword ? 'text' : 'password'}
              placeholder="Password"
              size="medium"
              value={userData.password}
              onChange={(event) => {
                setUserData((prevState) => ({
                  ...prevState,
                  password: event.target.value,
                }));
              }}

              InputProps={{
                endAdornment: <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {userData.showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                              </InputAdornment>,
                
              }}
              
            />
             
          </div>
          <div style={{ padding: "10px 5px 10px 5px" }}>
            <TextField
              sx={styledTextField}
              required
              fullWidth
              label="Confirmar password"
              id="fullWidth password2"
              name="password2"
              type={userData.showPassword2 ? 'text' : 'password'}
              placeholder="Password"
              size="medium"
              onChange={(event) => {
                setUserData((prevState) => ({
                  ...prevState,
                  password2: event.target.value,
                }));
              }}

              InputProps={{
                endAdornment: <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword2}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {userData.showPassword2 ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                              </InputAdornment>,
                
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
                size="medium"
                disablePortal
                blurOnSelect
                id="combo-box-demo-2"
                value={userData.gender}
                options={genders}
                
                onChange={(event, newGender) => {
                  setUserData((prevState) => ({
                    ...prevState,
                    gender: newGender,
                  }));
                }}
                inputValue={inputGender}
                onInputChange={(event, newInputGender) => {
                  setInputGender(newInputGender);
                }}
                renderInput={(params) => {
                  const inputProps = params.inputProps;
                  inputProps.autoComplete = "off";

                  return (
                    <TextField
                      sx={styledTextField}
                      name="gender"
                      {...params}
                      inputProps={inputProps}
                      required
                      label="Gênro"
                    />
                )}}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </div>

            <div style={{ width: "49%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                label="Telefone"
                id="fullWidth phone"
                name="phone"
                type="number"
                placeholder="Telefone"
                size="medium"
                onChange={(event) => {
                  setUserData((prevState) => ({
                    ...prevState,
                    phone: event.target.value,
                  }));
                }}
              />
            </div>
          </Stack>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <Autocomplete
                fullWidth
                required
                size="medium"
                disablePortal
                blurOnSelect
                id="combo-box-demo-1"
                value={role}
                options={roles}
                onChange={(event, newRole) => {
                  setUserData((prevState) => ({
                    ...prevState,
                    role: newRole,
                  }));
                }}
                inputValue={inputRole}
                onInputChange={(event, newInputRole) => {
                  setInputRole(newInputRole);
                }}
                renderInput={(params) => {

                  const inputProps = params.inputProps;
                  inputProps.autoComplete = 'off';

                  return (
                  <TextField
                    sx={styledTextField}
                    name="role"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Perfil"
                  />
                )}}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </div>
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
          {/* <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          > */}
            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <Autocomplete
                fullWidth
                required
                size="medium"
                disablePortal
                blurOnSelect
                id="combo-box-demo-3"
                options={provinces || [""]}
                value={address?.province}
                onChange={(event, newProvince) => {
                  setUserData((prevState) => ({
                    ...prevState,
                    address: { ...prevState?.address, province: newProvince },
                  }));
                }}
                inputValue={inputProvince}
                onInputChange={(event, newInputProvince) => {
                  setInputProvince(newInputProvince);
                }}
                renderInput={(params) => {

                  const inputProps = params.inputProps;
                  inputProps.autoComplete = 'off';

                  return (
                    <TextField
                      sx={styledTextField}
                      name="province"
                      {...params}
                      inputProps={inputProps}
                      label="Província"
                      required
                      // helperText="Residência"
                    />
                )}}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </div>

            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <Autocomplete
                fullWidth
                required
                size="medium"
                disablePortal
                blurOnSelect
                id="combo-box-demo-4"
                value={address?.district}
                options={
                  address?.province
                    ? districts[address?.province]
                    : ["Primeiro, selecciona a província"]
                }
                onChange={(event, newDistrict) => {
                  if (!Array.isArray(districts[address?.province])) {
                    toast.error("Primeiro, seleciona a província!", {
                      autoClose: 5000,
                      position: toast.POSITION.TOP_RIGHT,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setUserData((prevState) => ({
                      ...prevState,
                      address: { ...prevState?.address, district: "" },
                    }));
                    return;
                  }
                  setUserData((prevState) => ({
                    ...prevState,
                    address: { ...prevState?.address, district: newDistrict },
                  }));
                }}
                inputValue={inputDistrict}
                onInputChange={(event, newInputDistrict) => {
                  setInputDistrict(newInputDistrict);
                }}
                renderInput={(params) => { 
                  
                  const inputProps = params.inputProps;
                  inputProps.autoComplete = 'off';

                  return (
                  <TextField
                    sx={styledTextField}
                    name="district"
                    {...params}
                    inputProps={inputProps}
                    label="Distrito"
                    required
                    // helperText="residência"
                  />
                )}}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </div>
          {/* </Stack> */}
          {/* <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          > */}
            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <Autocomplete
                fullWidth
                required
                size="medium"
                disablePortal
                blurOnSelect
                id="combo-box-demo-5"
                value={address?.territory}
                options={
                  address?.district
                    ? adminPosts[address?.district]
                    : ["Primeiro, selecciona o distrito"]
                }
                onChange={(event, newTerritory) => {
                  if (!Array.isArray(adminPosts[address?.district])) {
                    toast.error("Primeiro, seleciona o distrito!", {
                      autoClose: 5000,
                      position: toast.POSITION.TOP_RIGHT,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setTerritory("");
                    return;
                  }
                  setUserData((prevState) => ({
                    ...prevState,
                    address: { ...prevState.address, territory: newTerritory },
                  }));
                }}
                inputValue={inputTerritory}
                onInputChange={(event, newInputTerritory) => {
                  setInputTerritory(newInputTerritory);
                }}
                renderInput={(params) => {

                  const inputProps = params.inputProps;
                  inputProps.autoComplete = 'off';
                  
                  return (
                  <TextField
                    sx={styledTextField}
                    name="adminPost"
                    {...params}
                    inputProps={inputProps}
                    label="Posto Administrativo"
                    // helperText="residência"
                  />
                )}}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
              />
            </div>

          {/* </Stack> */}
          </Paper>

          <Box sx={{ marginTop: "15px"}}>
            <BootstrapButton variant="contained" type="submit">
              Criar conta
            </BootstrapButton>
          </Box>
        </Box>
      </Box>
    </Box>
    </Box>
  );
}

export default UserRegister;
