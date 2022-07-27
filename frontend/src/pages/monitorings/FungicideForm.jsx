
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
import { 
    fungicides, 
    applicationNumbers, 
    fungicideDoses, 
    northernRegion, 
    southernRegion, 
    fungicideByDisease
} from "../../app/fungicides"
import { diseases } from "../../app/diseases";
import { centerAndSouthProvinces, northProvinces, provinces } from "../../app/provinces"

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

function InsecticideForm({ user }) {
  
  const [reportData, setReportData] = useState({
    diseaseName: '',
    fungicideName: '',
    treatedTrees: '',
    applicationNumber: '',
    dose: '',
    appliedAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [inputFungicideName, setInputFungicideName] = useState('');
  const [inputDiseaseName, setInputDiseaseName] = useState('');


  const [inputDose, setInputDose] = useState('');
  const [inputApplicationNumber, setInputApplicationNumber] = useState('');
  const [customizedApplicationNumbers, setCustomizedApplicationNumbers] = useState([]);

 
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()

//   let newPruningTypes;

  const { division, flag, farmland } = location?.state;

  let newApplicationNumbers = [];


  useEffect(() => {
    if ((reportData.diseaseName && reportData.fungicideName) || reportData.diseaseName ){
      setReportData((prevState)=>({
        ...prevState,
        fungicideName: ""
      }))
    }
  }, [reportData.diseaseName]);

  // useEffect(()=>{

  // }, [reportData, location])


  useEffect(()=>{

    if (northProvinces.indexOf(farmland?.province) >= 0 && reportData?.diseaseName === 'Oídio'){
      setCustomizedApplicationNumbers([ "primeira", "segunda", "terceira", ])
    }
    else if (centerAndSouthProvinces.indexOf(farmland?.province) >= 0 && reportData?.diseaseName === 'Oídio'){
      setCustomizedApplicationNumbers([ "primeira", "segunda", "intercalar", "terceira", ])
    }
    else if (reportData?.diseaseName === 'Antracnose' && reportData.fungicideName ===  "Coprox Super"){
      setCustomizedApplicationNumbers([ "primeira", "segunda", "terceira", "quarta", "quinta", ])
    }
    else if (reportData?.diseaseName === 'Antracnose'){
      setCustomizedApplicationNumbers([ "primeira", "segunda", "terceira", ])
    }
    else{
      setCustomizedApplicationNumbers([ "primeira", "segunda", "terceira", "quarta", "quinta", ])
    }
    
  }, [ reportData?.diseaseName, reportData?.fungicideName])


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!(diseases.indexOf(reportData?.diseaseName) >= 0))  {
      toast.error("Seleccionar o tipo de doença.", {
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

    if (!(fungicides.indexOf(reportData?.fungicideName) >= 0))  {
      toast.error("Seleccionar a fungicida aplicada", {
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

    if (!(applicationNumbers.indexOf(reportData?.applicationNumber) >= 0))  {
      toast.error("Seleccionar o número da aplicação", {
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

    if (!(fungicideDoses.indexOf(reportData?.dose) >= 0))  {
      toast.error("Seleccionar a dose da aplicação", {
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


    if ((Number(reportData?.treatedTrees) > division?.trees ) || Number(reportData?.treatedTrees) <= 0) {
      toast.error("Fornecer número certo de cajueiros tratados", {
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

    const date = new Date(reportData?.appliedAt);

    if ( !Date.parse(reportData?.appliedAt) || (date > new Date())) {
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
        pageDescription={"Fungicida aplicada"}
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
              value={reportData?.diseaseName}
              options={diseases || ['']}
              // getOptionLabel={(option)=>option ? option : 'Seleccionar o tipo de praga'}
              onChange={(event, newDiseaseName) => {
                setReportData(prevState=>({
                    ...prevState,
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
                    label="Tipo de doença"
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
              blurOnSelect
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.fungicideName}
              options={
                reportData?.diseaseName
                  ? fungicideByDisease[reportData?.diseaseName]
                  : ["Primeiro, seleccionar o tipo de doença!"]
              }
              // getOptionLabel={(option)=>option ? option : 'Seleccionar a fungicida aplicada'}
              onChange={(event, newFungicideName) => {
                if (!Array.isArray(fungicideByDisease[reportData?.diseaseName])) {
                    toast.error("Primeiro, selecciona o tipo de doença!", {
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

                setReportData(prevState=>({
                    ...prevState,
                    fungicideName: newFungicideName,
                }));
              }}
              inputValue={inputFungicideName}
              onInputChange={(event, newInputFungicideName) => {
                setInputFungicideName(newInputFungicideName);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="fungicideName"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Fungicida aplicada"
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
              blurOnSelect
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.dose || ''}
              options={fungicideDoses}
              getOptionLabel={(option)=>option ? option : 'Seleccionar a dose aplicada'}
              onChange={(event, newDose) => {
                setReportData(prevState=>({
                    ...reportData,
                    dose: newDose,
                }));
              }}
              inputValue={inputDose}
              onInputChange={(event, inputDose) => {
                setInputDose(inputDose);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="dose"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="A dose aplicada"
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
              blurOnSelect
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.applicationNumber}
              options={
                // applicationNumbers
                customizedApplicationNumbers
              }
              getOptionLabel={(option)=>option ? option : 'Seleccionar o número de aplicação'}
              onChange={(event, newApplicationNumber) => {
                setReportData(prevState=>({
                    ...reportData,
                    applicationNumber: newApplicationNumber,
                }));
              }}
              inputValue={inputApplicationNumber}
              onInputChange={(event, newInputApplicationNumber) => {
                setInputApplicationNumber(newInputApplicationNumber);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="applicationNumber"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Número de aplicação"
                  />
              )}}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />

            </div>


        <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
            <TextField
            sx={styledTextField}
            fullWidth
            required
            label="Cajueiros tratados"
            id="fullWidth treatedTrees"
            name="treatedTrees"
            type="number"
            value={reportData?.treatedTrees || ''}
            placeholder="Cajueiros tratados"
            size="medium"
            onChange={(event) => {
                setReportData((prevState) => ({
                ...prevState,
                treatedTrees: event.target.value,
                }));
            }}
            />
        </div>


          <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data em que se realizou esta aplicação" 
                onChange={(newDate)=>{
                  setReportData((prevState)=>({
                    ...prevState,
                    appliedAt: newDate
                  }))
                }}
                value={reportData?.appliedAt || null}
                renderInput={(params)=>(
                  <TextField {...params}
                    id="date"
                    size="medium"
                    name="appliedAt"
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

export default InsecticideForm;
