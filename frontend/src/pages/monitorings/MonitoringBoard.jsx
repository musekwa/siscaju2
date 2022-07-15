import React, {  startTransition, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import { Autocomplete, Box, CardMedia, Grid, Paper, Stack, TextField, } from "@mui/material";
import Footer from "../../components/Footer";
import {Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import insecticide from '../../assets/images/insecticide.jpg'
import crop from '../../assets/images/crop.jpg'
import plague from '../../assets/images/plague.jpg'
import disease from '../../assets/images/disease.jpg'
import weeding from '../../assets/images/weeding.jpg'
import pruning from '../../assets/images/pruning.jpg'
import { styled } from "@mui/system";
import { months } from "../../app/months";
import { monitoringQuestions } from "../../app/monitoringQuestions";
import { monitoringVariables } from "../../app/monitoringVariables";
import MonitoringBoardModal from "../../components/MonitoringBoardModal";
import { useGetMonitoringReportsQuery } from "../../features/api/apiSlice";



const UserStack = styled(Stack)(({theme})=>({
    gap: "5px",
    width: "100%",
    marginRight: "10px",

}))

const styledTextField = {
  color: "gray",
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


  const [openModal, setOpenModal] = useState(false);
  const [sowingYear, setSowingYear] = useState('');
  const [question, setQuestion] = useState({
    question: '',
    flag: '',
  });
  const [inputSowingYear, setInputSowingYear] = useState("");
  const [division, setDivision] = useState(null);
  const [report, setReport] = useState(null);
 

  const handleSowingYear = (event) => {
    setSowingYear(event.target.value);
  };

  const navigate = useNavigate();
  const location = useLocation()

  let farmland; 
  let sowingYears;


  farmland = location?.state?.farmland;
  sowingYears = farmland?.divisions?.map(division=>division?.sowingYear);

  

  const { 
    data: monitoringReports, 
    isSuccess, 
    isLoading, 
    isError, 
    error  
  } = useGetMonitoringReportsQuery(division || "");


  useEffect(()=>{

    if (sowingYear && farmland) {
      let newDivision = farmland?.divisions?.filter(division=>division?.sowingYear === sowingYear)
      // if (sowingYear !== newDivision.sowingYear){
      setDivision(newDivision[0])
      // }
    }
    if (isSuccess && monitoringReports && monitoringReports?.length > 0 && Array.isArray(monitoringReports)) {
      let sortedReports = monitoringReports.sort(function(a, b){
        return  b?.year - a?.year;
      })
      setReport(sortedReports[0]);

    }
    else {
      setReport(null)
    }

  }, [sowingYear, farmland, division, monitoringReports, report, isSuccess, isLoading, isError, error, location, navigate ])



  // get all the last modified monitoring reports
  let lastMonitorings = {};

  if (report) {

    for (let property in report) { // loop over the report 
      let value = report[property];
      if (((monitoringVariables.indexOf(property)) >= 0) && Array.isArray(value) && (value?.length > 0)) {

        lastMonitorings[`${property}`] = value[value.length - 1];

      }
    }
    
  }

  if (isLoading) {
      return <Spinner />
  }


if (!farmland) {
  navigate('/monitorings-list')
  return ;
}

const normalizeDate = (date) => {
  return (
    new Date(date).getDate() +
    "-" +
    months[new Date(date).getMonth()] +
    "-" +
    new Date(date).getFullYear()
  );
};

const transferedPackage = {
  question: question?.question,
  flag: question?.flag,
  variableLastModifiedAt: lastMonitorings[question?.flag]
                              ? normalizeDate(lastMonitorings[question?.flag].updatedAt)
                              : report 
                              ? normalizeDate(report?.updatedAt) 
                              : normalizeDate(division?.createdAt),
  division: division,
  farmland: farmland,
}

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
        marginTop: "10px",
        color: "gray"  }} 
       >
 
        <Stack direction="row" sx={{ padding: "10px 10px 10px 10px"}} >
            <Autocomplete
              fullWidth
              required
              size="small"
              disablePortal
              id="combo-box-demo-2"
              value={sowingYear}
              options={sowingYears}
              getOptionLabel={(option)=>option ? JSON.stringify(option) : 'Seleccionar o ano de plantio'}
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
                    sx={styledTextField }
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
        { report 
        ? 
        <>
          <span style={{ display: "block" }}>Última monitoria: {normalizeDate(report?.updatedAt)}</span> 
          <span style={{ display: "block" }}>(por {report?.user?.fullname})</span>
        </>
        : `Esta será a primeira monitoria desta divisão!`} 
        {/* Última monitoria: 02/01/2021 por Evariste */}
      </Typography>
        <Grid container direction="column" justifyContent="center" alignItems="center" >
        <Stack direction="row" spacing={3} sx={{ margin: "15px 5px 10px 5px"}}>
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
                  height="105px"
                  image={weeding}
                  alt="weeding"
                />
                <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.weeding ? normalizeDate(lastMonitorings?.weeding?.updatedAt) : `Ainda não monitorada`}</Typography>
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
                height="105px"
                image={pruning}
                alt="pruning"
              />
              <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.pruning ? normalizeDate(lastMonitorings?.pruning?.updatedAt) : `Ainda não monitorada`}</Typography>
              </Box>
              {/* </Link> */}
          </Paper>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ margin: "15px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
              {/* <Link to='/diseases-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                      ...prevState,
                      question: monitoringQuestions?.disease,
                      flag: 'disease'
                    }))
                  setOpenModal(true)
                }}
            >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Doenças</Typography>
              <CardMedia
                component="img"
                width= "150px"
                height="105px"
                image={disease}
                alt="disease"
                />
              <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.disease ? normalizeDate(lastMonitorings?.disease?.updatedAt) : `Ainda não monitorada`}</Typography>
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
                    question: monitoringQuestions.plague,
                    flag: 'plague'
                  }))
                  setOpenModal(true)
                }}
              >
                <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Pragas</Typography>
                <CardMedia
                  component="img"
                  width= "150px"
                  height="105px"
                  image={plague}
                  alt="plague"
                />
                <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.plague ? normalizeDate(lastMonitorings?.plague?.updatedAt) : `Ainda não monitorada`}</Typography>
            </Box>
            {/* </Link> */}
          </Paper>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ margin: "15px 5px 10px 5px"}}>
          <Paper sx={{ width: "150px", height: "150px", backgroundColor: "#826DA3" }}>
            {/* <Link to='/insecticide-add'> */}
            <Box 
                component="button" 
                sx={{ backgroundColor: "#826DA3", border: '1px dashed grey', width: "100%"}}
                onClick={()=>{
                  setQuestion(prevState=>({
                    ...prevState,
                    question: monitoringQuestions.insecticide,
                    flag: 'insecticide'
                  }))
                  setOpenModal(true)
                }}
              >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Insecticidas</Typography>
          
              <CardMedia
                component="img"
                width="150px"
                height="105px"
                image={insecticide}
                alt="insecticide"
                />
                <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.insecticide ? normalizeDate(lastMonitorings?.insecticide?.updatedAt) : `Ainda não monitorada`}</Typography>
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
                    question: monitoringQuestions.fungicide,
                    flag: 'fungicide'
                  }))
                  setOpenModal(true)
                }}
              >
              <Typography sx={{ color: "#eee",  fontWeight: 800, }}>Fungicidas</Typography>

              <CardMedia
              component="img"
              width= "150px"
              height="105px"
              image={insecticide}
              alt="fungicide"
              />
              <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.fungicide ? normalizeDate(lastMonitorings?.fungicide?.updatedAt) : `Ainda não monitorada`}</Typography>
            </Box>
            {/* </Link> */}
          </Paper>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ margin: "15px 5px 10px 5px"}}>
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
                height="105px"
                image={crop}
                alt="crop"
                />
              <Typography sx={{ color: "#eee",  fontSize: "12px" }}>{lastMonitorings?.harvest ? normalizeDate(lastMonitorings?.harvest?.updatedAt) : `Ainda não monitorada`}</Typography>
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
          // question={question} // question and flag
          // division={division}
          // farmland={farmland}
          // lastReportDate={report ? normalizeDate(report?.updatedAt) : normalizeDate(division?.createdAt)}
          transferedPackage={transferedPackage}
        />
      <Footer />
      </Box>
  );
};

export default MonitoringBoard;
