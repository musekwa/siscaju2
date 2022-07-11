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
import MonitoringBoardModal from "../../components/MonitoringBoardModal";


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


const MonitoringBoard = ({ user }) => {

  let filterBy =
    user?.role === "Extensionista"
      ? user?.address?.district
      : user?.role === "Gestor"
      ? user?.address?.province
      : user?.role === "Produtor"
      ? user?.address?.territory
      : null;

  // const {
  //   data: farmers,
  //   isLoading,
  //   isFetching,
  //   isError,
  //   isSuccess,
  //   error,
  // } = useGetFarmersByQuery(filterBy);

  const [openModal, setOpenModal] = useState(false);
  const [sowingYear, setSowingYear] = useState('');
  const [question, setQuestion] = useState({
    question: '',
    flag: '',
  });
  const [inputSowingYear, setInputSowingYear] = useState("");
  const [division, setDivision] = useState(null);

  const handleSowingYear = (event) => {
    setSowingYear(event.target.value);
  };

  const navigate = useNavigate();
  const location = useLocation()

  let farmland; 
  let sowingYears;

  // if (farmland) {
    farmland = location?.state?.farmland;
    sowingYears = farmland?.divisions?.map(division=>division?.sowingYear);
  // }

  useEffect(()=>{

    if (sowingYear && farmland) {
      let newDivision = farmland?.divisions?.filter(division=>division?.sowingYear === sowingYear)
      // if (sowingYear !== newDivision.sowingYear){
      setDivision(newDivision[0])
      // }
    }

  }, [sowingYear, farmland])

  // console.log('sowing year: ', sowingYear)

  useEffect(()=>{

  // if (!farmland) {
  //   navigate('/monitorings-list')
  // }
  //   if (farmers && farmers.length === 0) {
  //     toast.warning(
  //       "Primeiro, regista-se produtores (proprietários) de pomares!",
  //       {
  //         autoClose: 5000,
  //         position: toast.POSITION.TOP_RIGHT,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       }
  //     );
  //   navigate("/");
  //   return ;
  // }
  // if (!farmland) {
   
  //     toast.warning(
  //       "Seleccionar pomar que pretende monitorar!",
  //       {
  //         autoClose: 5000,
  //         position: toast.POSITION.TOP_RIGHT,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       }
  //     );
  //   navigate("/monitorings-list");
  //   return ;
  // }
  }, [farmland])

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
                  <Typography variant='body1'>{`${farmland?.farmer?.fullname}`}</Typography>
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
            <Typography sx={{ textAlign: "left"}} variant='body2'>[ {`${sowingYears?.sort()?.join(", ")?.toString()}`} ]</Typography>
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
      <Typography variant="body2" sx={{margin: "2px 2px 5px 2px",  }}>
        Última monitoria: 02/01/2021 por Evariste
      </Typography>
        <Grid container direction="column" justifyContent="center" alignItems="center" >
        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              {/* <Link to='/weeding-add'> */}
              <Box 
                  component="button" 
                  sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                  onClick={()=>{
                    setQuestion(prevState=>({
                      ...prevState,
                      question: monitoringQuestions.weeding,
                      flag: 'weeding'
                    }))
                    setOpenModal(true)
                  }}
                >
                <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Limpeza</Typography>
                <CardMedia
                  component="img"
                  width= "150px"
                  height="125px"
                  image={weeding}
                  alt="weeding"
              />
              </Box>
             {/* </Link> */}
          </Paper>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
               {/* <Link to='/pruning-add'> */}
               <Box 
                  component="button" 
                  sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}} 
                  onClick={()=>{
                    setQuestion(prevState=>({
                      ...prevState,
                      question: monitoringQuestions.pruning,
                      flag: 'pruning'
                    }))
                    setOpenModal(true)

                  }}
              >
              <Typography sx={{ color: "#eee", fontWeight: 800, }}>Poda</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={pruning}
                alt="pruning"
              />
              </Box>
              {/* </Link> */}
          </Paper>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              {/* <Link to='/diseases-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                      ...prevState,
                      question: monitoringQuestions.diseases,
                      flag: 'diseases'
                    }))
                  setOpenModal(true)
                }}
            >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Doenças</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={diseases}
                alt="diseases"
                />
            </Box>
             {/* </Link> */}
          </Paper>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
            {/* <Link to='/plagues-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                    ...prevState,
                    question: monitoringQuestions.plagues,
                    flag: 'plagues'
                  }))
                  setOpenModal(true)
                }}
              >
                <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Pragas</Typography>
                <CardMedia
                  component="img"
                  width= "150px"
                  height="125px"
                  image={plagues}
                  alt="plague"
                />
            </Box>
            {/* </Link> */}
          </Paper>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
            {/* <Link to='/insecticide-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                    ...prevState,
                    question: monitoringQuestions.insecticides,
                    flag: 'insecticides'
                  }))
                  setOpenModal(true)
                }}
              >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Insecticidas</Typography>
          
              <CardMedia
                component="img"
                width="150px"
                height="125px"
                image={insecticide}
                alt="insecticide"
                />
            </Box>
          {/* </Link> */}
          </Paper>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              {/* <Link to='/fungicide-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                    ...prevState,
                    question: monitoringQuestions.fungicides,
                    flag: 'fungicides'
                  }))
                  setOpenModal(true)
                }}
              >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Fungicidas</Typography>

              <CardMedia
              component="img"
              width= "150px"
              height="125px"
              image={insecticide}
              alt="fungicide"
              />
            </Box>
            {/* </Link> */}
          </Paper>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ margin: "5px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              {/* <Link to='/crop-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                    ...prevState,
                    question: monitoringQuestions.harvest,
                    flag: 'harvest'
                  }))
                  setOpenModal(true)
                }}
                
            >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Colheitas</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="125px"
                image={crop}
                alt="crop"
                />
            </Box>
            {/* </Link> */}
          </Paper>
          <Box sx={{ display: "block", width: "150px", height: "150px" }}>
          </Box>
        </Stack>
        </Grid>
      </Box>
  )}
        <MonitoringBoardModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          question={question}
          division={division}
        />
      <Footer />
      </Box>
  );
};

export default MonitoringBoard;
