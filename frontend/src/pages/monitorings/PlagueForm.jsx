import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { BootstrapButton } from "../../components/Buttons";


import {
    Autocomplete,
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
import { plagues } from "../../app/plagues"



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


function PlagueForm({ user }) {
  
  const [reportData, setReportData] = useState({
    plagueName: '',
    higherAttack: '',
    highAttack: '',
    averageAttack: '',
    lowAttack: '',
    detectedAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [inputPlagueName, setInputPlagueName] = useState('');
 
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()

//   let newPruningTypes;

  const { division, flag, farmland } = location?.state;


//   if ((new Date().getFullYear - division?.sowingYear) <= 3) {
//     newPruningTypes = pruningTypes?.filter(type=>!type.includes('rejuvenescimento'));
//   }
//   else {
//     newPruningTypes = pruningTypes?.filter(type=>!type.includes('formação'));
//   }

  useEffect(()=>{

  }, [reportData, location])


  const onSubmit = async (e) => {
    e.preventDefault();

    const remainder = division?.trees - 
        (Number(reportData?.higherAttack) + Number(reportData?.highAttack) + Number(reportData?.averageAttack) + Number(reportData?.lowAttack) );

    if (!(plagues.indexOf(reportData?.plagueName) >= 0))  {
      toast.error("Seleccionar a praga detectada", {
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
        !reportData?.higherAttack || 
        !reportData?.highAttack || 
        !reportData?.averageAttack ||
        !reportData?.lowAttack )  {
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
      (Number(reportData?.higherAttack) < 0 || Number(reportData?.higherAttack) > division?.trees) ||
      (Number(reportData?.highAttack) < 0 || Number(reportData?.highAttack) > division?.trees) ||
      (Number(reportData?.averageAttack) < 0 || Number(reportData?.averageAttack) > division?.trees) ||
      (Number(reportData?.lowAttack) < 0 || Number(reportData?.lowAttack) > division?.trees) 
      
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

    const date = new Date(reportData?.detectedAt);

    if ( !Date.parse(reportData?.detectedAt) || (date > new Date())) {
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
    
  };

  return (
    <Box>
      <Navbar
        arrowBack={"block"}
        goBack={"/monitorings-list"}
        pageDescription={"Praga detectada"}
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

       {/* <Box
        sx={{         
        margin: 'auto',
        maxWidth: 500,
        flexGrow: 1,
        marginTop: "10px",
        color: "gray"  }} 
       > */}
 
        {/* <Stack direction="row" sx={{ padding: "10px 10px 10px 10px"}} > */}
            <Autocomplete
              fullWidth
              required
              size="medium"
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.plagueName || ''}
              options={plagues}
              getOptionLabel={(option)=>option ? option : 'Seleccionar a praga detectada'}
              onChange={(event, newPlagueName) => {
                setReportData(prevState=>({
                    ...reportData,
                    plagueName: newPlagueName,
                }));
              }}
              inputValue={inputPlagueName}
              onInputChange={(event, newInputPlagueName) => {
                setInputPlagueName(newInputPlagueName);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="plagueName"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Praga detectada"
                  />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value
              }
            />
        {/* </Stack> */}
        {/* </Box> */}

            </div>

            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com grau de ataque muito alto"
                id="fullWidth higherAttack"
                name="higherAttack"
                type="number"
                value={reportData?.higherAttack || ''}
                placeholder="Cajueiros com grau de ataque muito alto"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    higherAttack: event.target.value,
                  }));
                }}
              />
            </div>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com grau de ataque alto"
                id="fullWidth highAttack"
                name="highAttack"
                type="number"
                 value={reportData?.highAttack || ''}
                placeholder="Cajueiros com grau de ataque alto"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    highAttack: event.target.value,
                  }));
                }}
              />
            </div>

            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com grau de ataque moderado"
                id="fullWidth averageAttack"
                name="averageAttack"
                type="number"
                value={reportData?.averageAttack || ''}
                placeholder="Cajueiros com grau de ataque moderado"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    averageAttack: event.target.value,
                  }));
                }}
              />
            </div>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com grau de ataque baixo"
                id="fullWidth lowAttack"
                name="highAttack"
                type="number"
                 value={reportData?.lowAttack || ''}
                placeholder="Cajueiros com grau de ataque baixo"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    lowAttack: event.target.value,
                  }));
                }}
              />
            </div>

          <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data em que se detectou a praga" 
                onChange={(newDate)=>{
                  setReportData((prevState)=>({
                    ...prevState,
                    detectedAt: newDate
                  }))
                }}
                value={reportData?.detectedAt || null}
                renderInput={(params)=>(
                  <TextField {...params}
                    id="date"
                    size="medium"
                    name="detectedAt"
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

export default PlagueForm;
