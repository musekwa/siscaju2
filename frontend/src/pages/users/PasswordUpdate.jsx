
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BootstrapButton } from '../../components/Buttons';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { reset, resetPassword, passwordUpdate } from "../../features/users/emailSlice"

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

const PasswordUpdate = () => {

    const [userData, setUserData] = useState({
        password: '',
        password2: '',
        showPassword: false,
        showPassword2: false,
        submitted: false,
    })
    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate()

    const { userId, token } = params;


   const { password, isLoading, isError, isSuccess, message } = useSelector((state) => state.email)
    
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

    useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Password Actualizado com sucesso!`,
        {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        }
      );

      navigate("/signin" );
      setUserData(prevState=>({
        ...prevState,
        password: "",
        password2: "",
        submitted: true,
        }));
    }
    else if (isError && message === 'Network Error') {
      toast.error("Verifique a conexão da Internet!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
   else if (isError && message?.includes('status code 400')) {
      toast.error("Este utilizador ainda não foi registado!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    else if (isError) {
      toast.error(message ? message : "Algo deu errado!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    dispatch(reset());
  }, [userData, password, isError, isSuccess, message, dispatch]);

      const onSubmit = async (e)=>{
        e.preventDefault();

        if (
            (userData.password && (userData.password !== userData.password2))
            || (!userData.password || !userData.password2)
            ) {
            toast.error("Passwords não correspondem!", {
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

        const normalizedUserData = {
            password: userData.password,
            userId,
            token,
        };

        if (!isLoading) {
            dispatch(passwordUpdate(normalizedUserData));
        }
    }


  return (
            <Box>
            <Navbar
                arrowBack={"block"}
                goBack={"/signin"}
                pageDescription={"Recuperação de password"}
            />
            <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "80vh",
            }}
            >
                {   isLoading ? <Spinner /> :
                    isSuccess ?
               (
               <Stack direction="column" style={{ padding: "10px 35px 10px 35px" }}> 

                    <Box sx={{ marginBottom: "20px", }}>
                        <Typography  variant="body1">
                            Siga instruções de recuperação de password 
                            enviadas para o seu endereço email.
                        </Typography>
                    </Box>
                    <Box sx={{  }}>
                        <Link to="/signin" style={{  color: "rebeccapurple" }}  >
                            Voltar para o login
                        </Link>
                    </Box>
                </Stack>
                 ) 
                 : 
        
            ( <Box sx={{ maxWidth: "500px", minWidth: "350px", padding: "30px"}} component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
            <Stack direction="column" style={{ padding: "10px 0px 10px 0px" }}>
                <div style={{ padding: "10px 5px 10px 5px" }}>
            <TextField
              sx={styledTextField}
              required
              fullWidth
              label="Novo password"
              id="fullWidth password"
              name="password"
              type={userData.showPassword ? 'text' : 'password'}
              placeholder="Novo password"
              size="small"
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
              label="Confirmar novo password"
              id="fullWidth password2"
              name="password2"
              type={userData.showPassword2 ? 'text' : 'password'}
              placeholder="Confirmar novo password"
              size="small"
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

            </Stack>
            <Box sx={{ marginTop: "15px", display: (`${userData.submitted}` ||  `${userData.failedSubmission}` ) ? 'block' : 'none' }}>
                <BootstrapButton variant="contained" type="submit">
                Actualizar password
                </BootstrapButton>
            </Box>
        </Box>
    )}
        </Box>
        </Box>

  )
}

export default PasswordUpdate