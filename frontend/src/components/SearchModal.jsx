
import { CheckCircleOutlined, FamilyRestroom, Forest, ForestRounded, ForestSharp, ForestTwoTone, MonetizationOn, NoAccounts, Person, ReportProblem, ThumbUpAlt, WatchOff } from '@mui/icons-material'
import { Backdrop, Box, Divider, Fade, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material'
import React from 'react'

const SearchModal = ({ openModal, setOpenModal, modalFlag, ...props }) => {

  return (
        <Modal
        keepMounted
        open={openModal}
        onClose={(event)=>setOpenModal(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
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
            // p: 2,
            
          }}>
  { modalFlag === 'farmers' && (<List>
  
              <ListItem >
                <ListItemButton>
                  <ListItemIcon>
                    <FamilyRestroom fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px"}}>Produtores familiares</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider  />
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <MonetizationOn fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px"}}>Produtores comerciais</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider  />
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <NoAccounts fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px" }}>Produtores não categorizados</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>              
            </List>
          )}


  { modalFlag === 'farmlands' && (<List>
  
              <ListItem >
                <ListItemButton>
                  <ListItemIcon>
                    <Forest fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px"}}>Pomares antigos</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider  />
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <ForestTwoTone fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px"}}>Pomares novos</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>             
            </List>
          )}


  { modalFlag === 'monitoring' && (<List>
  
              <ListItem >
                <ListItemButton>
                  <ListItemIcon>
                    <ReportProblem fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px"}}>Pomares em alto risco</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider  />
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <CheckCircleOutlined fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px"}}>Pomares em bom estado</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider  />
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <WatchOff fontSize="large" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ color: "gray", fontSize: "17px" }}>Pomares não monitorados</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>              
            </List>
          )}

        </Box>
        </Fade>
      </Modal>

  )
}

export default SearchModal