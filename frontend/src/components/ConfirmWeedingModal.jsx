import React from "react";
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
import { BootstrapButton, QuestionButton } from "./Buttons";

const ConfirmWeedingModal = ({ openModal, setOpenModal, weedingData, division }) => {


  const navigate = useNavigate();

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
                        // backgroundColor: "#826DA3", 
                        borderRadius: "20px 20px 0px 0px",
                        width: "100%",
                        height: "30%",
                        color: "gray"
                    }}
                >
                    <Box sx={{ p: "15px 15px 5px 15px" }}>
                    <Stack direction="row">
                        <Typography sx={{ width: "50%", textAlign: "left"}}>Totalmente limpos:</Typography>
                        <Typography sx={{ width: "50%", textAlign: "center"}}>{weedingData?.totallyCleanedTrees || 0}</Typography>
                    </Stack>
                    <Stack direction="row" >
                        <Typography sx={{ width: "50%", textAlign: "left"}}>Parcialmente limpos:</Typography>
                        <Typography sx={{ width: "50%", textAlign: "center"}}>{weedingData?.partiallyCleanedTrees || 0}</Typography>
                    </Stack>
                    <Stack direction="row" >
                        <Typography sx={{ width: "50%", textAlign: "left"}}>Não limpos:</Typography>
                        <Typography sx={{ width: "50%", textAlign: "center"}}>{division?.trees - (Number(weedingData?.totallyCleanedTrees) + Number(weedingData?.partiallyCleanedTrees))}</Typography>
                    </Stack>
                    <Stack>
                        <Typography sx={{  textAlign: 'center', }} variant="h6">Confirma?</Typography>
                    </Stack>
                    </Box>
                </Box>
               
            </Box>
            
            <Box
              sx={{
                position: "relative",
                bottom: 3,
                left: 0,
                // p: 2,
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
                    <QuestionButton sx={{ color: "#eee" }}>Sim</QuestionButton>
                </Box>
                <Box 
                    sx={{ 
                        width: "50%", 
                        textAlign: "center",
                        // border: "1px solid"
                    }}>
                    <QuestionButton 
                        sx={{ color: "#eee", width: "20px" }}
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

export default ConfirmWeedingModal;
