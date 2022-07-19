import React, { useEffect} from "react";
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


const MonitoringBoardModal = ({ 
                      openModal, 
                      setOpenModal, 
                      transferedPackage
                      // division, 
                      // question, 
                      // farmland, 
                      // lastReportDate 
                    }) => {

  const navigate = useNavigate();

  useEffect(()=>{

  }, [navigate])

  const onConfirm = () =>{

    const { division, flag, farmland } = transferedPackage;

    switch(flag) {
      case 'weeding':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }})
        break;
      case 'pruning':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }})
        break;
      case 'disease':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }})
        break;
      case 'plague':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }})
        break;
      case 'insecticide':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }})
        break;
      case 'fungicide':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }});
        break;
      case 'harvest':
        navigate(`/${flag}-add`, { state: { division, flag, farmland }})
        break;
      default:
        console.log(`Indicar a variavel: ${flag} que pretende monitorar`)

    }

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
                        backgroundColor: "#826DA3", 
                        borderRadius: "20px 20px 0px 0px",
                        width: "100%",
                        height: "auto"
                        // height: "30%"
                    }}
                >

                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       Ano de plantio: {transferedPackage?.division?.sowingYear}
                    </Typography>
                </Box>
                <Box 
                  sx={{  
                    textAlign: 'center', 
                    color: "gray",
                    padding: "25px 10px 0px 10px" }}
                >
                <Typography  variant="h6">{transferedPackage?.question}{", desde "} {transferedPackage?.variableLastModifiedAt}?</Typography>
                </Box>
            </Box>
            <Box
              sx={{
                position: "relative",
                bottom: 4,
                left: 0,
                p: 2,
                // backgroundColor: "#826DA3",
                // width: "100%",
                // height: "35%",
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
                      onClick={onConfirm}
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
                        sx={{ color: "#eee" }}
                        onClick={()=>{
                          setOpenModal(false)
                        }}
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

export default MonitoringBoardModal;
