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
import { pruningTypes } from "../../app/pruningTypes";



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




function PruningForm({ user }) {
  
  const [reportData, setReportData] = useState({
    totallyPrunedTrees: '',
    partiallyPrunedTrees: '',
    pruningType: '',
    prunedAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [inputPruningType, setInputPruningType] = useState('');
 
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()

  let newPruningTypes;

  const { division, flag, farmland } = location?.state;


  if ((new Date().getFullYear - division?.sowingYear) <= 3) {
    newPruningTypes = pruningTypes?.filter(type=>!type.includes('rejuvenescimento'));
  }
  else {
    newPruningTypes = pruningTypes?.filter(type=>!type.includes('formação'));
  }

  useEffect(()=>{

  }, [reportData, location])


  const onSubmit = async (e) => {
    e.preventDefault();

    const remainder = division?.trees - (Number(reportData?.totallyPrunedTrees) + Number(reportData?.partiallyPrunedTrees));

    if (!(pruningTypes.indexOf(reportData?.pruningType) >= 0))  {
      toast.error("Indicar o tipo de poda", {
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

    if (!reportData?.totallyPrunedTrees || !reportData?.partiallyPrunedTrees)  {
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
      (Number(reportData?.totallyPrunedTrees) < 0 || Number(reportData?.totallyPrunedTrees) > division?.trees) ||
      (Number(reportData?.partiallyPrunedTrees) < 0 || Number(reportData?.partiallyPrunedTrees) > division?.trees)
      
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

    const date = new Date(reportData?.prunedAt);

    if ( !Date.parse(reportData?.prunedAt) || (date > new Date())) {
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
        pageDescription={"Controle de Poda"}
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
 
        {/* <Stack direction="row" sx={{ padding: "10px 10px 10px 10px"}} > */}
            <Autocomplete
              fullWidth
              required
              size="medium"
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.pruningType || ''}
              options={newPruningTypes}
              getOptionLabel={(option)=>option ? option : 'Seleccionar o tipo de poda'}
              onChange={(event, newPruningType) => {
                setReportData(prevState=>({
                    ...reportData,
                    pruningType: newPruningType,
                }));
              }}
              inputValue={inputPruningType}
              onInputChange={(event, newInputPruningType) => {
                setInputPruningType(newInputPruningType);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="pruningType"
                    {...params}
                    inputProps={inputProps}
                    required
                   
                    label="Tipo de poda"
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
                label="Cajueiros totalmente podados"
                id="fullWidth totallyPrunedTrees"
                name="totallyPrunedTrees"
                type="number"
                value={reportData?.totallyPrunedTrees || ''}
                placeholder="Cajueiros totalmente podados"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    totallyPrunedTrees: event.target.value,
                  }));
                }}
              />
            </div>


            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <TextField
                sx={styledTextField}
                fullWidth
                required
                label="Cajueiros parcialmente podados"
                id="fullWidth partiallyPrunedTrees"
                name="partiallyPrunedTrees"
                type="number"
                 value={reportData?.partiallyPrunedTrees || ''}
                placeholder="Cajueiros parcialmente podados"
                size="medium"
                onChange={(event) => {
                  setReportData((prevState) => ({
                    ...prevState,
                    partiallyPrunedTrees: event.target.value,
                  }));
                }}
              />
            </div>


          <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data em que se fez a poda" 
                onChange={(newDate)=>{
                  setReportData((prevState)=>({
                    ...prevState,
                    prunedAt: newDate
                  }))
                }}
                value={reportData?.prunedAt || null}
                renderInput={(params)=>(
                  <TextField {...params}
                    id="date"
                    size="medium"
                    name="prunedAt"
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

export default PruningForm;
