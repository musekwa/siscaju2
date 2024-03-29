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
import { insecticides, applicationNumbers, insecticideDoses, insecticideByPlague } from "../../app/insecticides"
import { plagues } from "../../app/plagues";



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
    plagueName: '',
    insecticideName: '',
    treatedTrees: '',
    applicationNumber: '',
    dose: '',
    appliedAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [inputInsecticideName, setInputInsecticideName] = useState('');
  const [inputPlagueName, setInputPlagueName] = useState('');
  const [inputDose, setInputDose] = useState('');
  const [inputApplicationNumber, setInputApplicationNumber] = useState('');
 
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()

//   let newPruningTypes;

  const { division, flag, farmland } = location?.state;


  useEffect(()=>{

  }, [reportData, location])

  useEffect(() => {
    if ((reportData.plagueName && reportData.insecticideName) || reportData.plagueName ){
      setReportData((prevState)=>({
        ...prevState,
        insecticideName: ""
      }))
    }
  }, [reportData.plagueName]);


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!(plagues.indexOf(reportData?.plagueName) >= 0))  {
      toast.error("Seleccionar o tipo de praga", {
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

    if (!(insecticides.indexOf(reportData?.insecticideName) >= 0))  {
      toast.error("Seleccionar a insecticida aplicada", {
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

    if (!(insecticideDoses.indexOf(reportData?.dose) >= 0))  {
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
        pageDescription={"Insecticida aplicada"}
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
              value={reportData?.plagueName}
              options={plagues || ['']}
              // getOptionLabel={(option)=>option ? option : 'Seleccionar o tipo de praga'}
              onChange={(event, newPlagueName) => {
                setReportData(prevState=>({
                    ...prevState,
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
                    label="Tipo de praga"
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
              value={reportData?.insecticideName}
              options={
                reportData?.plagueName
                  ? insecticideByPlague[reportData?.plagueName]
                  : ["Primeiro, seleccionar o tipo de praga!"]
                // insecticides
              }
              // getOptionLabel={(option)=>option ? option : 'Seleccionar a insecticida aplicada'}
              onChange={(event, newInsecticideName) => {
                if (!Array.isArray(insecticideByPlague[reportData?.plagueName])) {
                    toast.error("Primeiro, selecciona o tipo de praga!", {
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
                    insecticideName: newInsecticideName,
                }));
              }}
              inputValue={inputInsecticideName}
              onInputChange={(event, newInputInsecticideName) => {
                setInputInsecticideName(newInputInsecticideName);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="insecticideName"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Insecticida aplicada"
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
              options={insecticideDoses}
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
              value={reportData?.applicationNumber || ''}
              options={applicationNumbers}
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
