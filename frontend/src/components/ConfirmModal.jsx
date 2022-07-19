import React, { useEffect } from "react";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BootstrapButton, QuestionButton } from "./Buttons";
import { useAddMonitoringReportMutation } from "../features/api/apiSlice";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ConfirmModal = ({ openModal, setOpenModal, setReportData, reportData, division, flag, farmland }) => {

  const navigate = useNavigate();

  const { 
    user, 
    isloading: userIsLoading, 
    isError: userIsError, 
    isSuccess: userIsSuccess, 
  } = useSelector((state)=>state.user)

  const [ 
      addMonitoringReport, 
      { data: monitoring, isSuccess, isError, isLoading, error} 
    ] = useAddMonitoringReportMutation()


  useEffect(()=>{

    if (isError && error.status === 'FETCH_ERROR') {
      toast.error("Verifique a conexão da Internet!", {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (isError){
      toast.error(error.error, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,
      });
    } 
    else if (isSuccess) {
      toast.success(`Actualizado o estado do pomar com sucesso!`, {
        autoClose: 5000,
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER,        
      })     
      // setReportData(null);
      // if (flag !== 'pruning') {
        // navigate('/monitoring-board', { state: { farmland }})
        navigate('/monitoring-board', { state: { farmland }})
        setOpenModal(false)
      // }
      
      


    }
    // reset()

  }, [monitoring, isError, isSuccess, error, navigate])

  const onReject = ()=>{

    if (flag === 'pruning') {
      navigate('/monitoring-board', { state: { farmland }})
      // setReportData({
      //   totallyPrunedTrees: '',
      //   partiallyPrunedTrees: '',
      //   pruningType: '',
      //   prunedAt: null,
      // });
      setOpenModal(false)
      return ;
    }
    else {
      setOpenModal(false)
    }
  }



  const onSubmit = async (e)=>{

      const normalizedData = {
        ...reportData,
        division,
        flag,
        user: {
          fullname: user?.fullname,
          email: user?.email,
          phone: user?.phone,
        },
        status: 'approved',
      }  
    
    if (!isLoading && normalizedData) {
      await addMonitoringReport(normalizedData);
    }

  }

  if (isLoading || userIsLoading) {
    return <Spinner />
  }

  return (
    <Modal
      keepMounted
      open={openModal}
      onClose={(event) => setOpenModal(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            borderRadius: "20px",
            height: "40vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            // p: 2,
          }}
        >
            <Box
              sx={{
                position: "relative",
                top: 0,
                left: 0,
                // right: 0,
                // p: 2,
                // backgroundColor: "#826DA3",
                width: "100%",
                height: "75%",
                borderRadius: "20px",
                // border: "1px solid"
              }}
            >
                <Box 
                    sx={{ 
                        // backgroundColor: "#826DA3", 
                        borderRadius: "20px 20px 0px 0px",
                        width: "100%",
                        // height: "50%",
                        color: "gray"
                    }}
                >
        {                    
            flag === "weeding"  &&     
            (
              <Box>
                <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       Limpeza
                    </Typography>
                </Box>
                  <Box  sx={{ p: "20px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "5px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Totalmente limpos:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.totallyCleanedTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row"  sx={{ p: "5px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Parcialmente limpos:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.partiallyCleanedTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row"  sx={{ p: "5px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Não limpos:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{division?.trees - (Number(reportData?.totallyCleanedTrees) + Number(reportData?.partiallyCleanedTrees))}</Typography>
                      </Stack>
                      <Stack  sx={{ p: "5px 0px 0px 0px",  }} >
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                    </Box>
                  )
          }

          {                    
            flag === "pruning"  &&  !isSuccess &&    
            ( <Box>   
              <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       {reportData?.pruningType}
                    </Typography>
                </Box>
                  <Box sx={{ p: "20px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Totalmente podados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.totallyPrunedTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "5px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Parcialmente podados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.partiallyPrunedTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "5px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Não podados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{division?.trees - (Number(reportData?.totallyPrunedTrees) + Number(reportData?.partiallyPrunedTrees))}</Typography>
                      </Stack>
                      <Stack sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  )
          }

          {                    
            flag === "disease"  &&  !isSuccess &&    
            ( <Box>   
              <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       {reportData?.diseaseName}
                    </Typography>
                </Box>
                  <Box sx={{ p: "5px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "3px 0px 0px 0px",  }}>
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Severidade muito alta:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.higherSeverity || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Severidade alta:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.highSeverity || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Severidade moderada:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.averageSeverity || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Severidade baixa:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.lowSeverity || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Sem infecção:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>
                            {division?.trees - 
                          (Number(reportData?.higherSeverity) + Number(reportData?.highSeverity) + Number(reportData?.averageSeverity) + Number(reportData?.lowSeverity))}</Typography>
                      </Stack>
                      <Stack sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  )
          }


          {                    
            flag === "plague"  &&  !isSuccess &&    
            ( <Box>   
              <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       {reportData?.plagueName}
                    </Typography>
                </Box>
                  <Box sx={{ p: "5px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "3px 0px 0px 0px",  }}>
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Vítimas de ataque muito alto:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.higherAttack || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Vítimas de ataque alto:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.highAttack || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Vítimas de ataque moderado:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.averageAttack || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Vítimas de ataque baixo:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.lowAttack || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Sem infecção:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>
                            {division?.trees - 
                          (Number(reportData?.higherAttack) + Number(reportData?.highAttack) + Number(reportData?.averageAttack) + Number(reportData?.lowAttack))}</Typography>
                      </Stack>
                      <Stack sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  )
          }



          {                    
            flag === "insecticide"  &&  !isSuccess &&    
            ( <Box>   
              <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       {reportData?.insecticideName}
                    </Typography>
                </Box>
                  <Box sx={{ p: "5px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "3px 0px 0px 0px",  }}>
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Cajueiros tratados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.treatedTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Número de aplicação:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.applicationNumber || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Dose aplicada:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.dose || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Cajueiros não tratados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>
                            {division?.trees - (Number(reportData?.treatedTrees) )}</Typography>
                      </Stack>
                      <Stack sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  )
          }





          {                    
            flag === "fungicide"  &&  !isSuccess &&    
            ( <Box>   
              <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       {reportData?.fungicideName}
                    </Typography>
                </Box>
                  <Box sx={{ p: "5px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "3px 0px 0px 0px",  }}>
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Cajueiros tratados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.treatedTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Número de aplicação:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.applicationNumber || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Dose aplicada:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.dose || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Cajueiros não tratados:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>
                            {division?.trees - (Number(reportData?.treatedTrees) )}</Typography>
                      </Stack>
                      <Stack sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  )
          }


          {                    
            flag === "harvest"  &&  !isSuccess &&    
            ( <Box>   
              <Box 
                sx={{ 
                    backgroundColor: "#826DA3", 
                    borderRadius: "20px 20px 0px 0px",
                    width: "100%",
                    height: "auto"
                    // height: "80%"
                }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                      Campanha {(new Date().getMonth()+1) < 3 ? (new Date().getFullYear() - 1) : (new Date().getFullYear())} 
                       {' '}-{' '}{(new Date().getMonth()+1) < 3 ? (new Date().getFullYear()) : (new Date().getFullYear() + 1)}
                    </Typography>
                </Box>
                  <Box sx={{ p: "5px 15px 5px 15px",  }}>
                      <Stack direction="row" sx={{ p: "3px 0px 0px 0px",  }}>
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Cajueiros produtivos:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.productiveTrees || 0}</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Quilogramas de pêra:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.appleQuantity || 0} Kgs</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ p: "1px 0px 0px 0px",  }} >
                          <Typography sx={{ width: "80%", textAlign: "left"}}>Quilogramas de castanha:</Typography>
                          <Typography sx={{ width: "50%", textAlign: "center"}}>{reportData?.nutQuantity || 0} Kgs</Typography>
                      </Stack>
                      <Stack sx={{ p: "5px 0px 0px 0px",  }}>
                          <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                      </Stack>
                    </Box>
                  </Box>
                  )
          }




                </Box>
               
            </Box>
            
            <Box
              sx={{
                position: "relative",
                bottom: 2,
                left: 0,
                // height: "20%",
              }}
            > 
             
                <Stack direction="row" sx={{ 
                    position: "relative", 
                    // bottom: 0,
                    // marginTop: "20px",
                    width: "100%",
                    }}>
                <Box 
                    sx={{ 
                        width: "50%", 
                        textAlign: "center",
                        // border: "1px solid"
                     }}>
                    <QuestionButton 
                      sx={{ color: "#eee" }}
                      onClick={onSubmit}
                    >
                      Sim
                    </QuestionButton>
                </Box>
                <Box 
                    sx={{ 
                        width: "50%", 
                        textAlign: "center",
                        // border: "1px solid"
                    }}>
                    <QuestionButton 
                        sx={{ color: "#eee", width: "20px" }}
                        onClick={onReject}
                    >
                            Não
                    </QuestionButton>
                </Box>
                </Stack>
                <Stack direction="row">
                    
                </Stack>
            </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ConfirmModal;
