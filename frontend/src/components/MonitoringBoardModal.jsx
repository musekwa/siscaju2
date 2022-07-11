import React, { useEffect} from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AddAPhoto, ArrowBack, Forest } from "@mui/icons-material";
import { BootstrapButton, QuestionButton } from "./Buttons";


const MonitoringBoardModal = ({ openModal, setOpenModal, division, question, farmland }) => {

  const navigate = useNavigate();

  useEffect(()=>{

  }, [navigate])

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
            height: "30vh",
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
                height: "70%",
                borderRadius: "20px",
                // border: "1px solid"
              }}
            >
                <Box 
                    sx={{ 
                        backgroundColor: "#826DA3", 
                        borderRadius: "20px 20px 0px 0px",
                        width: "100%",
                        height: "30%"
                    }}
                >
                    <Typography sx={{  textAlign: 'center', color: "#eee" }} variant="h6"> 
                       Ano de plantio: {}
                    </Typography>
                </Box>
                <Typography sx={{  textAlign: 'center', }} variant="h6">{question?.question}{", desde 23/Jan/2022"}{division?.updatedAt}?</Typography>
            </Box>
            <Box
              sx={{
                position: "relative",
                bottom: 3,
                left: 0,
                p: 2,
                // backgroundColor: "#826DA3",
                // width: "100%",
                height: "30%",
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
                      onClick={()=>{
                        navigate(`/${question?.flag}-add`, { state: { division, flag: question?.flag, farmland }})
                      }}
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
                        sx={{ color: "#eee", width: "20px" }}>
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
