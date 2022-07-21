import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Chip,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowBackIos, Logout, ManageSearch, PersonAdd, Search as SearchIcon, Settings } from '@mui/icons-material';
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetUser } from "../features/users/userSlice";
import { useDispatch } from "react-redux";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
}));



const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "&:hover": {
    cursor: "pointer",
  },
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "none",
  gap: "10px",
  alignItems: "center",
  "&:hover": {
    cursor: "pointer",
  },
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));




const Navbar = ({ 
    arrowBack, 
    goBack, 
    pageDescription, 
    user, 
    isSearchIcon, 
    isManageSearch, 
    modalFlag, 
    openModal, 
    setOpenModal }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  // const [openSearchModal, setOpenSearchModal] = useState(true)
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // --------------start account menu -------------------

  const [anchorElAccountMenu, setAnchorElAccountMenu] = useState(null);
  const openAccountMenu = Boolean(anchorElAccountMenu);
  const handleClickAccountMenu = (event) => {
    setAnchorElAccountMenu(event.currentTarget);
  };
  const handleCloseAccountMenu = () => {
    setAnchorElAccountMenu(null);
  };

  // ----------------------- end account menu ---------------


  const onLogout = ()=>{
    localStorage.removeItem('user');
    toast.info("Sessão terminada!", {
    autoClose: 5000,
    position: toast.POSITION.TOP_CENTER,
    });
    dispatch(resetUser())
    navigate("/signin");
    // setOpen(false);
    
  }

  useEffect(()=>{

  }, [isSearch])

    


  return (
    <Box
      sx={{
        zIndex: 10,
        position: "sticky",
        top: 0,
        right: 0,
        left: 0,
        height: "30px",
       
      }}
    >
{
 !isSearch ? (
      <AppBar
        sx={{
            height: "60px",
            backgroundColor: "rebeccapurple",
          }}
      >

      <StyledToolbar>
        {  user ? ( 
        
        <Fragment>
          <Stack
            direction="row"
            sx={{ width: "100%", textAlign: "center" }}
            gap={5}
          >
            <Box sx={{ display: arrowBack ? `${arrowBack}` : 'none', paddingTop: "6px" }} >
              <Link to={`${goBack}`}>
                <ArrowBackIos fontSize="medium" sx={{ color: "#ffffff"}} />
              </Link>
            </Box>
            <Box sx={{ paddingTop: "6px" }}>
              {pageDescription && (
                <Typography
                  variant="body1"
                  fontWeight={100}
                  component="p"
                  sx={{ p: "6px 0px 0px 0px" }}
                >
                  {pageDescription}
                </Typography>
              )}
            </Box>
            <Box>
              {
                isManageSearch && (
                  <IconButton  onClick={()=>{
                    setOpenModal(true)
                  }}>
                    <ManageSearch sx={{ color: "#eee"}} fontSize="large" />
                  </IconButton>
              )}
            </Box>
            <Box>
              {
                isSearchIcon && (
                  <IconButton onClick={()=>{
                    setIsSearch(true)
                  }}>
                    <SearchIcon sx={{ color: "#eee"}} fontSize="large" />
                  </IconButton>
              )}
            </Box>
          </Stack>
          <Tooltip title={`${user?.fullname.split(" ")[0]}`}>
            <IconButton             
              onClick={handleClickAccountMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
              />
            </IconButton>
          </Tooltip>
          <UserBox>
            <IconButton               
              onClick={handleClickAccountMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar />
            </IconButton>
            
            {/* <Avatar
              onClick={() => {}}
              sx={{ width: "40px", height: "40px" }}
              src={`#`}
            /> */}
            <Typography variant="body2">
              {user?.fullname.split(" ")[0]}
            </Typography>
          </UserBox>
        </Fragment>
        ) 
        : 
        (<Grid container>
          <Grid xs={2} item sx={{ display: arrowBack ? `${arrowBack}` : 'none'  }}>
                <Link to={`${goBack}`}>
                  <ArrowBackIos fontSize="large" sx={{ color: "#ffffff"}} />
                </Link>
            </Grid>
            <Grid item xs={10}>
              <Typography
                    variant="body1"
                    fontWeight={100}
                    component="p"
                    sx={{ p: "6px 0px 0px 0px", textAlign: "center" }}
                  >
                    {pageDescription}
              </Typography>
            </Grid>
          </Grid>
        )
        }
        </StyledToolbar>
  



        {/* -----------------------start account menu-------------------------- */}

        <Menu
        anchorEl={anchorElAccountMenu}
        id="account-menu"
        open={openAccountMenu}
        onClose={handleCloseAccountMenu}
        onClick={handleCloseAccountMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar /> Minha conta
        </MenuItem>
        <Divider />
        {/* <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem> */}
                
        <MenuItem onClick={()=>onLogout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Terminar a sessão
        </MenuItem>
        
        <Divider />

        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>

      </Menu>

      {/* -----------------------end account menu ------------------------------ */}
      </AppBar>
    ) 
    :
  // If isSearch is clicked
    
      // <AppBar
      //   sx={{
            // height: "180px",
            // bgcolor: "background.paper",
            // padding: "25px 5px 5px 15px",
      //     }}
      // >

      // </AppBar>
    (
      <AppBar         
        sx={{
            // height: "120px",
            bgcolor: "background.paper",
            color: "gray",
          }}>
        <Box >
                  <Stack direction="row"  
          sx={{             
            bgcolor: "background.paper",
            padding: "10px 0px 10px 10px",
            }}
          >
          <IconButton onClick={()=>{
            setIsSearch(false)
          }}>
            <ArrowBack fontSize="large" sx={{ color: "gray"}} />
          </IconButton>
          <Box sx={{ paddingTop: "10px" }}>
            <InputBase type="search"  sx={{ color: "gray", fontSize: "18px", }} placeholder="Pesquisar..." />
          </Box>
          <IconButton  type="submit" sx={{ }} aria-label="search">
            <SearchIcon fontSize="large" />
          </IconButton>
        </Stack>
        <Divider />  
          <Typography sx={{ p: 1 }} >      
            <Chip   
              sx={{ m: 0.5 }}
              label={`posto ` + user?.address?.territory}
              onClick={()=>{}}
              // onDelete={()=>{}} 
            />

            <Chip  
              sx={{ m: 0.5 }} 
              label={`distrito `+ user?.address?.district}
              onClick={()=>{}}
              // onDelete={()=>{}} 
            />

            <Chip  
              sx={{ m: 0.5 }} 
              label={`província `+ user?.address?.province}
              onClick={()=>{}}
              // onDelete={()=>{}} 
            />
          </Typography>


        </Box>
      </AppBar>
    )
  
  
}
{
  
   (false && <AppBar>

    <Modal
      keepMounted
      open={isSearch}
      onClose={(event) => setIsSearch(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isSearch}>
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            // right: 0,
            transform: "translate(-50%, -50%)",
            width: "100%",
            // borderRadius: "20px",
            // height: "30vh",
            paddingTop: "60px",
            bgcolor: "background.paper",
            boxShadow: 24,
            // p: 2,
          }}
        >
        
        <Stack direction="row"  
          sx={{             
            bgcolor: "background.paper",
            padding: "10px 0px 10px 10px",
            }}
          >
          <IconButton>
            <ArrowBack fontSize="large" sx={{ color: "gray"}} />
          </IconButton>
          <Box sx={{ paddingTop: "10px" }}>
            <InputBase type="search"  sx={{ color: "gray", fontSize: "18px", }} placeholder="Pesquisar..." />
          </Box>
          <IconButton  type="submit" sx={{ }} aria-label="search">
            <SearchIcon fontSize="large" />
          </IconButton>
        </Stack>
        <Divider />  
          <Typography sx={{ p: 1 }} >      
            <Chip   
              sx={{ m: 0.5 }}
              label={`posto ` + user?.address?.territory}
              onClick={()=>{}}
              // onDelete={()=>{}} 
            />

            <Chip  
              sx={{ m: 0.5 }} 
              label={`distrito `+ user?.address?.district}
              onClick={()=>{}}
              // onDelete={()=>{}} 
            />

            <Chip  
              sx={{ m: 0.5 }} 
              label={`província `+ user?.address?.province}
              onClick={()=>{}}
              // onDelete={()=>{}} 
            />
          </Typography>
        </Box>
      </Fade>
    </Modal>
    </AppBar>
 ) }

  {/* ------------------------- Search Modal ---------------------------------------------- */}
    </Box>
  );
};

export default Navbar;
