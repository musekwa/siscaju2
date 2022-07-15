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
import { insecticides, applicationNumbers, insecticideDoses } from "../../app/insecticides"



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
    productiveTrees: '',
    appleQuantity: '',
    nutQuantity: '',
    harvestedAt: null,
  });

  const [openModal, setOpenModal] = useState(false);
  // const [inputInsecticideName, setInputInsecticideName] = useState('');
  // const [inputDose, setInputDose] = useState('');
  // const [inputApplicationNumber, setInputApplicationNumber] = useState('');
 
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

    // const remainder = division?.trees - 
    //     (Number(reportData?.higherAttack) + Number(reportData?.highAttack) + Number(reportData?.averageAttack) + Number(reportData?.lowAttack) );

    if (!reportData?.productiveTrees || (reportData?.productiveTrees < 0) || (reportData?.productiveTrees > division?.trees))  {
      toast.error("Indicar número certo de cajueiros", {
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

    if (!reportData?.appleQuantity || reportData?.appleQuantity < 0)  {
      toast.error("Indicar a quantidade da pêra de caju", {
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

    if (!reportData?.nutQuantity || reportData?.nutQuantity < 0)  {
      toast.error("Indicar a quantidade da castanha de caju", {
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

    setOpenModal(true)
    
  };

  return (
    <Box>
      <Navbar
        arrowBack={"block"}
        goBack={"/monitorings-list"}
        pageDescription={"Colheita de caju"}
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
          <Box sx={{ display: "block", width: "100%", color: "gray" }}>
            <Typography variant="body1">
              {`Nesta divisão, há ${division?.trees} cajueiros de ${new Date().getFullYear() - division?.sowingYear} anos de idade.`}
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
            label="Cajueiros produtivos"
            id="fullWidth productiveTrees"
            name="productiveTrees"
            type="number"
            value={reportData?.productiveTrees || ''}
            placeholder="Cajueiros produtivos"
            size="small"
            onChange={(event) => {
                setReportData((prevState) => ({
                ...prevState,
                productiveTrees: event.target.value,
                }));
            }}
            />
        </div>

        <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
            <TextField
            sx={styledTextField}
            fullWidth
            required
            label="Quilogramas de pêra produzida"
            id="fullWidth appleQuantity"
            name="appleQuantity"
            type="number"
            value={reportData?.appleQuantity || ''}
            placeholder="Quilogramas de pêra produzida"
            size="small"
            onChange={(event) => {
                setReportData((prevState) => ({
                ...prevState,
                appleQuantity: event.target.value,
                }));
            }}
            />
        </div>

        <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
            <TextField
            sx={styledTextField}
            fullWidth
            required
            label="Quilogramas de castanha produzida"
            id="fullWidth nutQuantity"
            name="nutQuantity"
            type="number"
            value={reportData?.nutQuantity || ''}
            placeholder="Quilogramas de castanha produzida"
            size="small"
            onChange={(event) => {
                setReportData((prevState) => ({
                ...prevState,
                nutQuantity: event.target.value,
                }));
            }}
            />
        </div>

          <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
              <DatePicker 
                label="Data em que se realizou a colheita" 
                onChange={(newDate)=>{
                  setReportData((prevState)=>({
                    ...prevState,
                    harvestedAt: newDate
                  }))
                }}
                value={reportData?.harvestedAt || null}
                renderInput={(params)=>(
                  <TextField {...params}
                    id="date"
                    size="small"
                    name="harvestedAt"
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
