import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { BootstrapButton } from "../../components/Buttons";


import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { reset, register, resetUser } from "../../features/users/userSlice"
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DatePicker } from "@mui/x-date-pickers";
import ConfirmModal from "../../components/ConfirmModal";



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




function WeedingForm({ user }) {
  
  const [reportData, setReportData] = useState({
    totallyCleanedTrees: null,
    partiallyCleanedTrees: null,
    weededAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
 
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()

  const { division, flag, farmland } = location.state;

  useEffect(()=>{

  }, [reportData])

  // useEffect(() => {
  //   if (isSuccess && user && JSON.stringify(user)?.includes('timed out after')) {
  //       toast.error(`Verifique a conexão da Internet!`, {
  //         autoClose: 5000,
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //       localStorage.removeItem('user');
  //       dispatch(resetUser());
  //       return ;
  //   } 
  //   else if (isSuccess) {
  //     toast.success(
  //       `Olá ${user?.fullname?.split(" ")[0]}, Bem-vindo a SisCaju!`,
  //       {
  //         autoClose: 5000,
  //         position: toast.POSITION.TOP_CENTER,
  //       }
  //     );
  //     navigate("/", { state: { user } });
  //     setUserData({
  //       fullname: "",
  //       email: "",
  //       password: "",
  //       password2: "",
  //       gender: "",
  //       role: "",
  //       phone: "",
  //       address: {
  //         province: "",
  //         district: "",
  //         territory: "",
  //       },
  //     });
  //   }
  //   else if (isError && message === 'Network Error') {
  //     toast.error("Verifique a conexão da Internet!", {
  //       autoClose: 5000,
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  //   else if (isError && message?.includes('status code 400')) {
  //     toast.error("Credenciais inválidas!", {
  //       autoClose: 5000,
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  //   else if (isError && message?.includes('status code 409')) {
  //     toast.error("Este utilizador já foi registado!", {
  //       autoClose: 5000,
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  //   else if (isError) {
  //     toast.error(message ? message : "O registo falhou!", {
  //       autoClose: 5000,
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  //   dispatch(reset());
  // }, [user, isError, isSuccess, message, navigate, register, dispatch]);

  // useEffect(() => {
  //   if ((address.province && address.district) || address.province) {
  //     setUserData((prevState)=>({
  //       ...prevState,
  //       address: { ...prevState.address, district: "", territory: "" }
  //     }))
  //   }
  // }, [address.province]);

  // useEffect(() => {
  //   if ((address.district && address.territory) || address.district) {
  //     setUserData((prevState)=>({
  //       ...prevState,
  //       address: { ...prevState.address, territory: "" }
  //     }))
  //   }
  // }, [address.district]);

  // if (isSuccess) {
  //   window.location.reload(false)
  //    return <Navigate to={'/'} replace />
  // }



  const onSubmit = async (e) => {
    e.preventDefault();

    const remainder = division?.trees - (Number(reportData?.totallyCleanedTrees) + Number(reportData?.partiallyCleanedTrees));

    if (!reportData?.totallyCleanedTrees || !reportData?.partiallyCleanedTrees)  {
      toast.error("Completar informação obrigatória", {
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

    if (
      (remainder < 0 || remainder > division?.trees) ||
      (Number(reportData?.totallyCleanedTrees) < 0 || Number(reportData?.totallyCleanedTrees) > division?.trees) ||
      (Number(reportData?.partiallyCleanedTrees) < 0 || Number(reportData?.partiallyCleanedTrees) > division?.trees)
      
      ) {
      toast.error("Fornecer números certos", {
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

     const date = new Date(reportData?.weededAt);

    if ( !Date.parse(reportData?.weededAt) || (date > new Date())) {
        toast.error("Indicar a data certa", {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      return;
    }
    
    
    setOpenModal(true)

    // const normalizedWeedingData = {
    //   ...weedingData,
    //   division,
    // };

    // if (!isLoading) {
    //   dispatch(register(normalizedUserData));
    // }
    
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }


  return (
    <Box>
      <Navbar
        arrowBack={"block"}
        goBack={"/monitorings-list"}
        pageDescription={"Controle de Limpeza"}
        user={user}
      />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "60px",
      }}
    >

      <Box 
        sx={{ position: "relative", bottom: "80px", marginTop: "100px"  }}
        component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
          <Box sx={{ display: "block", width: "100%", color: "gray", padding: "5px 20px 0px 20px" }}>
            <Typography variant="body1">
              {`Nesta unidade de produção, há ${division?.trees} cajueiros de ${new Date().getFullYear() - division?.sowingYear} anos de idade.`}
            </Typography>
          </Box>
          <Paper
            sx={{
            minWidth: "300px",
            maxWidth: "500px",
            height: "auto",
            textAlign: "center",
            m: "10px",
            p: "10px 0px 10px 0px",
            }}
            >
            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros totalmente limpos"
                id="fullWidth totallyCleanedTrees"
                name="totallyCleanedTrees"
                type="number"
                placeholder="Cajueiros totalmente limpos"
                size="small"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    totallyCleanedTrees: event.target.value,
                  }));
                }}
              />
            </div>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros parcialmente limpos"
                id="fullWidth partiallyCleanedTrees"
                name="partiallyCleanedTrees"
                type="number"
                placeholder="Cajueiros parcialmente limpos"
                size="small"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    partiallyCleanedTrees: event.target.value,
                  }));
                }}
              />
            </div>


          <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data em que se fez a limpeza" 
                onChange={(newDate)=>{
                  setReportData((prevState)=>({
                    ...prevState,
                    weededAt: newDate
                  }))
                }}
                value={reportData?.weededAt}
                renderInput={(params)=>(
                  <TextField {...params}
                    id="date"
                    size="small"
                    name="weededAt"
                    fullWidth 
                    sx={styledTextField}
                  />)}          
                 />
            </div>


          <Box sx={{ marginTop: "15px"}}>
            <BootstrapButton variant="contained" type="submit">
              Salvar
            </BootstrapButton>
          </Box>
        </Paper>
      </Box>
    </Box>
    <ConfirmModal
      openModal={openModal}
      setOpenModal={setOpenModal}
      reportData={reportData} 
      setReportData={setReportData}
      division={division}
      flag={flag}
      farmland={farmland}
    />
    <Footer />
    </Box>
  );
}

export default WeedingForm;
