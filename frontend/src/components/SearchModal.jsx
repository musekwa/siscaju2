
import { Backdrop, Box, Fade, Grid, Modal } from '@mui/material'
import React from 'react'

const SearchModal = ({ open, setOpen, ...props }) => {

  return (
        <Modal
        keepMounted
        open={open}
        onClose={(event)=>setOpen(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
        <Box sx={ {
            position: 'absolute',
            top: '95%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "100%",
            height: "70vh",
            bgcolor: 'background.paper',
            borderTopRightRadius: '10%',
            borderTopLeftRadius: '10%',
            boxShadow: 24,
            p: 4,
            
          }}>

          <Grid container sx={{ mt: 3,  }}>
            <Grid item xs={5} sx={{ textAlign: "left"}} >
                
            </Grid>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={5} sx={{ textAlign: "right" }}>

            </Grid>
          </Grid>
          <Grid container sx={{ mt: 7 }}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>

            </Grid>
          </Grid>
        </Box>
        </Fade>
      </Modal>

  )
}

export default SearchModal