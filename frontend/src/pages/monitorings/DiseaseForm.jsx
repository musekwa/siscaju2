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
import { diseases } from "../../app/diseases"



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


function DiseaseForm({ user }) {
  
  const [reportData, setReportData] = useState({
    diseaseName: '',
    higherSeverity: '',
    highSeverity: '',
    averageSeverity: '',
    lowSeverity: '',
    detectedAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [inputDiseaseName, setInputDiseaseName] = useState('');
 
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
        (Number(reportData?.higherSeverity) + Number(reportData?.highSeverity) + Number(reportData?.averageSeverity) + Number(reportData?.lowSeverity) );

    if (!(diseases.indexOf(reportData?.diseaseName) >= 0))  {
      toast.error("Seleccionar a doença detectada", {
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
        !reportData?.higherSeverity || 
        !reportData?.highSeverity || 
        !reportData?.averageSeverity ||
        !reportData?.lowSeverity )  {
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
      (Number(reportData?.higherSeverity) < 0 || Number(reportData?.higherSeverity) > division?.trees) ||
      (Number(reportData?.highSeverity) < 0 || Number(reportData?.highSeverity) > division?.trees) ||
      (Number(reportData?.averageSeverity) < 0 || Number(reportData?.averageSeverity) > division?.trees) ||
      (Number(reportData?.lowSeverity) < 0 || Number(reportData?.lowSeverity) > division?.trees) 
      
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
        pageDescription={"Doença detectada"}
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
          <Autocomplete
              fullWidth
              required
              size="medium"
              blurOnSelect
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.diseaseName || ''}
              options={diseases}
              getOptionLabel={(option)=>option ? option : 'Seleccionar a doença detectada'}
              onChange={(event, newDiseaseName) => {
                setReportData(prevState=>({
                    ...reportData,
                    diseaseName: newDiseaseName,
                }));
              }}
              inputValue={inputDiseaseName}
              onInputChange={(event, newInputDiseaseName) => {
                setInputDiseaseName(newInputDiseaseName);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="diseaseName"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Doença detectada"
                  />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value
              }
            />
            </div>

            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com severidade muito alta"
                id="fullWidth higherSeverity"
                name="higherSeverity"
                type="number"
                value={reportData?.higherSeverity || ''}
                placeholder="Cajueiros com severidade muito alta"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    higherSeverity: event.target.value,
                  }));
                }}
              />
            </div>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com severidade alta"
                id="fullWidth highSeverity"
                name="highSeverity"
                type="number"
                 value={reportData?.highSeverity || ''}
                placeholder="Cajueiros com severidade alta"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    highSeverity: event.target.value,
                  }));
                }}
              />
            </div>

            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com severidade moderada"
                id="fullWidth averageSeverity"
                name="averageSeverity"
                type="number"
                value={reportData?.averageSeverity || ''}
                placeholder="Cajueiros com severidade moderada"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    averageSeverity: event.target.value,
                  }));
                }}
              />
            </div>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros com severidade baixa"
                id="fullWidth lowSeverity"
                name="highSeverity"
                type="number"
                 value={reportData?.lowSeverity || ''}
                placeholder="Cajueiros com severidade baixa"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    lowSeverity: event.target.value,
                  }));
                }}
              />
            </div>

          <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data em que se detectou a doença" 
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

export default DiseaseForm;
