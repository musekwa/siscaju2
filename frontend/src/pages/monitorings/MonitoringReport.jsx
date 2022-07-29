import React, {  Fragment, startTransition, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/Navbar";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, CardMedia, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, } from "@mui/material";
import Footer from "../../components/Footer";
import {Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import insecticide from '../../assets/images/insecticide.jpeg'
import crop from '../../assets/images/crop.jpg'
import plague from '../../assets/images/plague.jpg'
import disease from '../../assets/images/disease.jpg'
import weeding from '../../assets/images/weeding.jpg'
import pruning from '../../assets/images/pruning.jpg'
import fungicide from '../../assets/images/fungicide.jpeg'
import { padding, styled } from "@mui/system";
import { months } from "../../app/months";
import { monitoringQuestions } from "../../app/monitoringQuestions";
import { monitoringVariables } from "../../app/monitoringVariables";
import MonitoringBoardModal from "../../components/MonitoringBoardModal";
import { useGetMonitoringReportsByFarmlandIdQuery } from "../../features/api/apiSlice";
import { ExpandMore, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { reportKit } from "../../app/reportKit"
import { calculatePercentage } from "../../libraries";


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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const normalizeDate = (date) => {
  return (
    new Date(date).getDate() +
    "-" +
    months[new Date(date).getMonth()] 
    // +
    // "-" +
    // new Date(date).getFullYear()
  );
};

const MonitoringReport = ({ user }) => {

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
   
    const [division, setDivision] = useState(null);
    const [reports, setReports] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
 

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
    data, 
    isSuccess, 
    isLoading, 
    isError, 
    error  
  } = useGetMonitoringReportsByFarmlandIdQuery(farmland._id || "");

  let newData = [];

    // group divisions' reports by their reporting year
    if (data) {
        // get all unique years (removing duplicates)
        let years = new Array(...new Set(data?.map(report=>JSON.stringify(report?.year))));

        for (let i = 0; i < years?.length; i++) {

            let year = JSON.stringify(years[i]);
            let yearlyReport = { }
            yearlyReport[`${year}`] = new Array();
            for (let j = 0; j < data?.length; j++) {
                if (data[j]?.year === Number(JSON.parse(year))) {      
                        yearlyReport[`${year}`]?.push(data[j]);
                }
            }

            newData.push(yearlyReport)
        }
    }

  useEffect(()=>{

    if (newData) {
        setReports(newData)
    }

  }, [
   
    farmland, 
    data,
    // reports,
    isSuccess, 
    isLoading, 
    isError, 
    error, 
    location, 
    navigate ])

  
  if (isLoading) {
      return <Spinner />
  }

//   console.log('farmalnd; ', farmland)


if (!farmland) {
  navigate('/monitorings-list')
  return ;
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
        }} 
       >
    {

    reports?.length === 0  &&
    (
        <Box
        sx={{
            height: "40vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" 
            }}
            >
            <Typography>Este pomar ainda não foi monitorado</Typography>
        </Box>
    )}

    <Paper 
        sx={{ 
            position: "relative", 
            bottom: "80px", 
            marginTop: "100px", 
            color: "gray",
        }}
    >
{
    reports?.length > 0 && 
    (

        reports.map(
            (yearlyReport, index)=>{

            return (
               <Box
                key={index}
               >

               <Accordion
               sx={{ minHeight: "100px" }}
                expanded={expanded === yearlyReport.year} 
                onChange={handleChangeAccordion(yearlyReport.year)}
                
                >
                <AccordionSummary expandIcon={<ExpandMore fontSize="large"  sx={{ color: "red" }}  />} aria-controls="panel1d-content" id="panel1d-header" sx={{ backgroundColor: "" }}>
                    <Typography variant="body1" sx={{ textAlign: "left", color: "red" }}>
                        Ralatório Anual - {Object.keys(yearlyReport)[0]}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        Object.values(yearlyReport)[0].map((divisionReport, index)=>{
                            let division = farmland.divisions.find(division=>division?._id === divisionReport?.division)
                            // console.log('division: ', division)
                            return (
                            <Fragment key={index}>
                                <Divider />

                                <Box sx={{ backgroundColor: "#343434", color: "#eee", padding: 1, }}>
                                <Grid container >
                                    <Grid item xs={6} sx={{ textAlign: "left"}}>
                                        <Typography>Ano de plantio:</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: "left"}}>
                                        <Typography>{division?.sowingYear} ({new Date().getFullYear() - division?.sowingYear} anos)</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container >
                                    <Grid item xs={6} sx={{ textAlign: "left"}}>
                                        <Typography>Cajueiros:</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: "left"}}>
                                        <Typography>{division?.trees} árvores</Typography>
                                    </Grid>
                                </Grid>
                                </Box>
                                    {
                                        reportKit.map((kit, index)=>{
                                            let key = Object.keys(kit)[0];

                                            if (divisionReport.hasOwnProperty(key) && key === 'weeding'){

                                                let kitRounds = divisionReport[key].rounds;


                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red", paddingBottom: 1, }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        <Grid container 
                                                            sx={{ 
                                                                    fontSize: "11px", 
                                                                    fontWeight: 600, 
                                                                    color: "#fff", 
                                                                    backgroundColor: "gray" 
                                                                }}
                                                            >
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Data
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Limpeza
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Totalmente limpos
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Parcialmente limpos
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />

                                                    {   kitRounds?.map(
                                                            (round, index)=>
                                                        <Fragment key={index}>
                                                        <Grid  container 
                                                            sx={{ 
                                                                fontSize: "10px", 
                                                                marginBottom: 1, 
                                                                marginTop: 1, 
                                                                }}
                                                        >
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {normalizeDate(new Date(round.weededAt))}
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {round?.weedingType?.split(' ')[1]}
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.totallyCleanedTrees, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.partiallyCleanedTrees, division?.trees)} %
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />
                                                        </Fragment>
                                                    ) }
                                                    </Box>
                                                )

                                            }
                                            else  if (divisionReport.hasOwnProperty(key) && key === 'pruning'){

                                                let kitRounds = divisionReport[key].rounds;

                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red", paddingBottom: 1, }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        <Grid container 
                                                            sx={{ 
                                                                    fontSize: "11px", 
                                                                    fontWeight: 600, 
                                                                    color: "#fff", 
                                                                    backgroundColor: "gray" 
                                                                }}
                                                            >
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Data
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Poda
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Totalmente podados
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                Parcialmente podados
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />

                                                    {   kitRounds?.map(
                                                            (round, index)=>
                                                        <Fragment key={index}>
                                                        <Grid  container 
                                                            sx={{ 
                                                                fontSize: "10px", 
                                                                marginBottom: 1, 
                                                                marginTop: 1, 
                                                                }}
                                                        >
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {normalizeDate(new Date(round.prunedAt))}
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {round?.pruningType?.split(' ')[2]}
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.totallyPrunedTrees, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={3} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.partiallyPrunedTrees, division?.trees)} %
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />
                                                        </Fragment>
                                                    ) }
                                                    </Box>
                                                )

                                            }
                                            else if (divisionReport.hasOwnProperty(key) && key === 'plague'){

                                                let kitRounds = divisionReport[key].rounds;

                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red", paddingBottom: 1, }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        <Grid container 
                                                            sx={{ 
                                                                    fontSize: "11px", 
                                                                    fontWeight: 600, 
                                                                    color: "#fff", 
                                                                    backgroundColor: "gray" 
                                                                }}
                                                            >
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Data
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Praga
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Ataque muito alto
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Ataque alto
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Ataque médio
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Ataque baixo
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />

                                                    {   kitRounds?.map(
                                                            (round, index)=>
                                                        <Fragment key={index}>
                                                        <Grid  container 
                                                            sx={{ 
                                                                fontSize: "10px", 
                                                                marginBottom: 1, 
                                                                marginTop: 1, 
                                                                }}
                                                        >
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {normalizeDate(new Date(round.detectedAt))}
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {round?.plagueName.toLowerCase()}
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.higherAttack, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.highAttack, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.averageAttack, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.lowAttack, division?.trees)} %
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />
                                                        </Fragment>
                                                    ) }
                                                    </Box>
                                                )

                                            }
                                            else if (divisionReport.hasOwnProperty(key) && key === 'insecticide'){

                                                let kitRounds = divisionReport[key].rounds;

                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red" }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        
                                                    </Box>
                                                )

                                            }
                                            else if (divisionReport.hasOwnProperty(key) && key === 'disease'){

                                                let kitRounds = divisionReport[key].rounds;

                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red", paddingBottom: 1, }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        <Grid container 
                                                            sx={{ 
                                                                    fontSize: "11px", 
                                                                    fontWeight: 600, 
                                                                    color: "#fff", 
                                                                    backgroundColor: "gray" 
                                                                }}
                                                            >
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Data
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Doença
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                               Severid. muito alta
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Severid. alta
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Severid. média
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                Severid. baixa
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />

                                                    {   kitRounds?.map(
                                                            (round, index)=>
                                                        <Fragment key={index}>
                                                        <Grid  container 
                                                            sx={{ 
                                                                fontSize: "10px", 
                                                                marginBottom: 1, 
                                                                marginTop: 1, 
                                                                }}
                                                        >
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {normalizeDate(new Date(round.detectedAt))}
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {round?.diseaseName.toLowerCase()}
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.higherSeverity, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.highSeverity, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.averageSeverity, division?.trees)} %
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ textAlign: "center"}}>
                                                                {calculatePercentage(round?.lowSeverity, division?.trees)} %
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />
                                                        </Fragment>
                                                    ) }
                                                    </Box>
                                                )

                                            }
                                            else if (divisionReport.hasOwnProperty(key) && key === 'fungicide'){

                                                let kitRounds = divisionReport[key].rounds;

                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red" }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        
                                                    </Box>
                                                )

                                            }
                                            else if (divisionReport.hasOwnProperty(key) && key === 'harvest'){

                                                let kitRounds = divisionReport[key].rounds;

                                                return (
                                                    <Box key={index} sx={{ marginTop: 1, marginBottom: 2,  }}>
                                                        <Typography sx={{ color: "red" }}>{capitalizeFirstLetter(kit[key])}</Typography>
                                                        
                                                    </Box>
                                                )

                                            }
                                            
                                            
                                            

                                        

                                        })
                                    }
                            </Fragment>
                        )
                        
                        })
                    }

         
                </AccordionDetails>
            </Accordion>
            
        </Box>
    


        
         )}  ))
    }
    
    </Paper>
    </Box>
    {/* <MonitoringBoardModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        // question={question} // question and flag
        // division={division}
        // farmland={farmland}
        // lastReportDate={report ? normalizeDate(report?.updatedAt) : normalizeDate(division?.createdAt)}
        transferedPackage={transferedPackage}
    /> */}
    <Footer />
    </Box>
  );
};

export default MonitoringReport;
