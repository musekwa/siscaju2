
import { Box, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BootstrapButton } from '../../components/Buttons';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { reset, resetEmail, passwordReset } from "../../features/users/emailSlice"


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


const PasswordRetrieve = () => {

    const [userData, setUserData] = useState({
        email: '',
        submitted: false,
        failedSubmission: false,
    });

    const dispatch = useDispatch()

    const { email, isLoading, isError, isSuccess, message } = useSelector((state) => state.email)

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Enviamos instruções por email. !`,
        {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
    //   navigate("/signin" );
      setUserData(prevState=>({
        ...prevState,
        email: "",
        submitted: true,
        }));
    }
    else if (isError && message === 'Network Error') {
      toast.error("Verifique a conexão da Internet!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    else if (isError && message?.includes('status code 404')) {
      toast.error("Este endereço email ainda não foi registado!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
        setUserData(prevState=>({
            ...prevState,
            email: "",
            failedSubmission: true,
        }))

    }
    // else if (isError && message?.includes('status code 409')) {
    //   toast.error("Este utilizador já foi registado!", {
    //     autoClose: 5000,
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // }
    else if (isError) {
      toast.error(message ? message : "Algo deu errado!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
    dispatch(reset());
  }, [email, isError, isSuccess, message, dispatch]);


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

    const onSubmit = async (e)=>{
        e.preventDefault();

        if (validateEmail(userData.email)) {
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

        // const normalizedUserData = {
        //     email: userData.email
        // };

        if (!isLoading) {
            dispatch(passwordReset(userData.email));
        }
    }

    // if (isLoading) {
    //     return <Spinner />
    // }

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
                     userData.submitted ?
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
                 userData.failedSubmission ?
               (
                <Stack direction="column" style={{ padding: "10px 35px 10px 35px" }}>
                    <Box sx={{ marginBottom: "20px"}}>
                        <Typography  variant="body1">
                            Não existe conta associada a este endereço email!
                        </Typography>
                    </Box>
                    <Box sx={{ }}>
                        <Link to="/signup" style={{  color: "rebeccapurple" }} >
                            Ir registar-se
                        </Link>
                    </Box>
                </Stack>
                 ) 
                 :

                
            ( <Box sx={{ maxWidth: "500px", minWidth: "350px", padding: "30px"}} component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
            <Stack direction="column" style={{ padding: "10px 0px 10px 0px" }}>
              
            
                <Fragment> 
                    <Box sx={{ marginBottom: "20px"}}>
                        <Typography  variant="body1">
                            Inserir o seu endereço email!
                        </Typography>
                    </Box>
                    <TextField
                    sx={styledTextField}
                    required
                    fullWidth
                    label="Email"
                    id="fullWidth email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    size="small"
                    value={userData.email}
                    onChange={(event) => {
                        setUserData((prevState) => ({
                        ...prevState,
                        email: event.target.value.toLowerCase(),
                        }));
                    }}
                    />
                </Fragment>

            
                
          

            </Stack>
            <Box sx={{ marginTop: "15px", display: (`${userData.submitted}` ||  `${userData.failedSubmission}` ) ? 'block' : 'none' }}>
                <BootstrapButton variant="contained" type="submit">
                Recuperar password
                </BootstrapButton>
            </Box>
        </Box>
    )}
        </Box>
        </Box>
  )
}

export default PasswordRetrieve