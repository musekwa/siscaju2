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
import { weedingTypes } from "../../app/weedingTypes";



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
    weedingType: '',
    totallyCleanedTrees: null,
    partiallyCleanedTrees: null,
    weededAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  const [inputWeedingType, setInputWeedingType] = useState('');
  
  // let newWeedingTypes;

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()

  const { division, flag, farmland } = location.state;

  useEffect(()=>{

  }, [reportData])


  const onSubmit = async (e) => {
    e.preventDefault();

    const remainder = division?.trees - (Number(reportData?.totallyCleanedTrees) + Number(reportData?.partiallyCleanedTrees));

    if (!(weedingTypes.indexOf(reportData?.weedingType) >= 0))  {
      toast.error("Indicar o tipo de limpeza", {
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
    
  };


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
           <Autocomplete
              fullWidth
              required
              size="medium"
              blurOnSelect
              disablePortal
              id="combo-box-demo-2"
              value={reportData?.weedingType || ''}
              options={weedingTypes}
              getOptionLabel={(option)=>option ? option : 'Seleccionar o tipo de limpeza'}
              onChange={(event, newWeedingType) => {
                setReportData(prevState=>({
                    ...reportData,
                    weedingType: newWeedingType,
                }));
              }}
              inputValue={inputWeedingType}
              onInputChange={(event, newInputWeedingType) => {
                setInputWeedingType(newInputWeedingType);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField }
                    name="weedingType"
                    {...params}
                    inputProps={inputProps}
                    required
                   
                    label="Tipo de limpeza"
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
                label="Cajueiros totalmente limpos"
                id="fullWidth totallyCleanedTrees"
                name="totallyCleanedTrees"
                type="number"
                placeholder="Cajueiros totalmente limpos"
                size="medium"
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
                size="medium"
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
                    size="medium"
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
