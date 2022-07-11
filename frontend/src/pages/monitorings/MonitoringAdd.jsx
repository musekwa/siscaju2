import React, {  startTransition, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import { Autocomplete, Box, Card, CardHeader, CardMedia, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, } from "@mui/material";
import Footer from "../../components/Footer";
import { AddCircle } from "@mui/icons-material";
import {Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
// import SearchModal from "../../components/SearchModal";
import { toast } from "react-toastify";
import { useGetFarmersByQuery } from "../../features/api/apiSlice";
import insecticide from '../../assets/images/insecticide.jpg'
import fungicide from '../../assets/images/fungicide.jpg'
import crop from '../../assets/images/crop.jpg'
import plagues from '../../assets/images/plagues.jpg'
import diseases from '../../assets/images/diseases.jpg'
import weeding from '../../assets/images/weeding.jpg'
import pruning from '../../assets/images/pruning.jpg'
import { styled } from "@mui/system";
import { months } from "../../app/months";
import { monitoringQuestions } from "../../app/monitoringQuestions";


const UserStack = styled(Stack)(({theme})=>({
    gap: "5px",
    width: "100%",
    marginRight: "10px",

}))

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


const MonitoringAdd = ({ user }) => {


  let filterBy =
    user?.role === "Extensionista"
      ? user?.address?.district
      : user?.role === "Gestor"
      ? user?.address?.province
      : user?.role === "Produtor"
      ? user?.address?.territory
      : null;

  const {
    data: farmers,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
  } = useGetFarmersByQuery(filterBy);

  const [sowingYear, setSowingYear] = useState('');
  const [inputSowingYear, setInputSowingYear] = useState("");

  const handleSowingYear = (event) => {
    setSowingYear(event.target.value);
  };

  const navigate = useNavigate();
  const location = useLocation()
  const { farmland } = location.state;

  const sowingYears = farmland?.divisions?.map(division=>division?.sowingYear)


  useEffect(()=>{
    if (farmers && farmers.length === 0) {
      toast.warning(
        "Primeiro, regista-se produtores (proprietários) de pomares!",
        {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    navigate("/");
    return ;
  }
  if (!farmland) {
   
      toast.warning(
        "Seleccionar pomar que pretende monitorar!",
        {
          autoClose: 5000,
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    navigate("/monitorings-list");
    return ;
  }
  }, [farmers, farmland])

//   if (isLoading || isFetching) {
//       return <Spinner />
//   }

//   const onAddMonitoring = (farmlandId) => {
//     let farmer = farmers.find((farmer) => farmer._id === farmerId);
//     startTransition(() => {
//       navigate("/farmlands", { state: { farmer: farmer } });
//     });
//   };

  return (
    <Box>
      <Navbar
        arrowBack={'block'}
        goBack={'/monitorings-list'}
        pageDescription={"Monitoria de pomar"}
        // isManageSearch={true}
        // isSearchIcon={true}
        user={user}
      />

      <Paper
      sx={{
        padding: 2,
        margin: 'auto',
        maxWidth: 500,
        flexGrow: 1,
        marginTop: "40px",
        color: "gray" 
      }}
    >
        <Grid 
          container 
          direction="column"       
        >
          <Grid item>
            <UserStack direction="row" onClick={()=>(true)} sx={{ m: "10px", }}>
              <Avatar sx={{ width: "50px", height: "50px"}} src="" />
              <Box sx={{ textAlign: "center", width: "80%", marginRight: "5px" }}>
                  <Typography variant='body1'>{`${farmland?.farmer.fullname}`}</Typography>
                  <Typography variant='body2'>({`${farmland?.farmer?.category}`})</Typography>
              </Box>
            </UserStack>
          </Grid>
          <Divider sx={{ margin: "5px 5px 5px 10px"}} />
        </Grid>
        <Grid container>
          <Grid item xs={6} >
            <Typography sx={{ textAlign: "left"}} variant='body2'>Designação do pomar:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ textAlign: "left"}} variant='body2'>{`${farmland?.label}`} ({`${farmland?.territory}`})</Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6} >
            <Typography sx={{ textAlign: "left"}} variant='body2'>Anos de plantio:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ textAlign: "left"}} variant='body2'>[ {`${sowingYears.sort()?.join(", ").toString()}`} ]</Typography>
          </Grid>
        </Grid>
       </Paper>

       <Box
        sx={{         
        margin: 'auto',
        maxWidth: 500,
        flexGrow: 1,
        marginTop: "20px",
        color: "gray"  }} 
       >
 
        <Stack direction="row" sx={{ padding: "10px 10px 10px 10px"}} >
          <Box sx={{ maxWidth: "49%"}}>
          <Typography 
              variant="body1" 
              sx={{ 
                textAlign: "left", 
              }}
          >
            Ano de plantio da divisão
          </Typography>
          </Box>
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo-2"
              value={sowingYear}
              options={sowingYears}
              getOptionLabel={(option)=>option ? JSON.stringify(option) : 'Nenhum'}
              onChange={(event, newSowingYear) => {
                setSowingYear(newSowingYear);
              }}
              inputValue={inputSowingYear}
              onInputChange={(event, newInputSowingYear) => {
                setInputSowingYear(newInputSowingYear);
              }}
              renderInput={(params) => {
                const inputProps = params.inputProps;
                inputProps.autoComplete = "off";

                return (
                  <TextField
                    sx={styledTextField}
                    name="sowingYear"
                    {...params}
                    inputProps={inputProps}
                    required
                    label="Ano de plantio"
                  />
              )}}
              isOptionEqualToValue={(option, value) =>
                value === undefined || value === "" || option === value
              }
            />
        </Stack>
        </Box>

{ sowingYear && (

  
  <Box sx={{ position: "relative", bottom: "80px", marginTop: "100px", color: "gray" }}>
      <Typography variant="body2" sx={{margin: "2px 2px 5px 2px",  }}>Última monitoria: 02/01/2021 por Evariste</Typography>
        <Grid container direction="column" justifyContent="center" alignItems="center" >
        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              <Link to='/weeding-add'>
                <Typography sx={{ color: "#eee" }}>Limpeza</Typography>
                <CardMedia
                  component="img"
                  width= "150px"
                  height="125px"
                  image={weeding}
                  alt="weeding"
              />
             </Link>
          </Paper>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
               <Link to='/pruning-add'>
              <Typography sx={{ color: "#eee" }}>Poda</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={pruning}
                alt="pruning"
              />
              </Link>
          </Paper>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              <Link to='/diseases-add'>
              <Typography sx={{ color: "#eee" }}>Doenças</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={diseases}
                alt="diseases"
                />
             </Link>
          </Paper>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
            <Link to='/plagues-add'>
              <Typography sx={{ color: "#eee" }}>Pragas</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={plagues}
                alt="plague"
            />
            </Link>
          </Paper>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
            <Link to='/insecticide-add'>
            <Typography sx={{ color: "#eee" }}>Insecticidas</Typography>
         
            <CardMedia
              component="img"
              width="150px"
              height="125px"
              image={insecticide}
              alt="insecticide"
              />
          </Link>
          </Paper>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              <Link to='/fungicide-add'>
              <Typography sx={{ color: "#eee" }}>Fungicidas</Typography>

              <CardMedia
              component="img"
              width= "150px"
              height="125px"
              image={insecticide}
              alt="fungicide"
              />
            </Link>
          </Paper>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              <Link to='/crop-add'>
              <Typography sx={{ color: "#eee" }}>Colheitas</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={crop}
                alt="crop"
                />
            </Link>
          </Paper>
          <Box sx={{ display: "block", width: "150px", height: "150px" }}>
          </Box>
        </Stack>
        </Grid>
      </Box>
  )}
      <Footer />
      </Box>
  );
};

export default MonitoringAdd;
