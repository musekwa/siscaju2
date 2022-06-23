import {
  AppBar,
  Avatar,
  Box,
  Grid,
  Menu,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ManageSearch, Search as SearchIcon } from '@mui/icons-material';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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


// const Search = styled("div")(({theme})=>({
//     backgroundColor: "white",
//     padding: "0 10px",
//     width: "80%",
//     marginLeft: "25px",
//     marginRight: "10px",
//     borderRadius: theme.shape.borderRadius,
//     [theme.breakpoints.up('md')]: {
//       width: "40%",
//     },
    
// }))

const Navbar = ({ pageDescription, user, isSearchIcon, isManageSearch }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  // const [open, setOpen] = useState(Boolean(anchorEl));
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const onLogout = ()=>{
    localStorage.removeItem('user');
    toast.info("Sessão terminada!", {
    autoClose: 5000,
    position: toast.POSITION.TOP_CENTER,
    });
    navigate("/signin");
    // setOpen(false);
    dispatch(resetUser())
  }

  // useEffect(()=>{
  //   if (!user) {
  //     toast.info("Sessão terminada!", {
  //       autoClose: 5000,
  //       position: toast.POSITION.TOP_CENTER,
  //     })
  //     navigate('/signin')
  //   }

  // }, [navigate, open, user]);

    


  return (
    <Box
      sx={{
        zIndex: 10,
        position: "sticky",
        top: 0,
        right: 0,
        left: 0,
        height: "30px"
       
      }}
    >
      <AppBar
        sx={{
          height: "60px",
          backgroundColor: "rebeccapurple",
         
        }}
      >
        <StyledToolbar>
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            SisCaju
          </Typography>

          <Stack
            direction="row"
            sx={{ width: "100%", textAlign: "center" }}
            gap={3}
          >
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={3}>
              {
                isManageSearch && <ManageSearch fontSize="large" />
                // <Search>
                //   <InputBase placeholder="Procurar produtor..." />
                // </Search>
              }
            </Grid>
            <Grid item xs={3}>
              {isSearchIcon && <SearchIcon fontSize="large" />}
            </Grid>
          </Stack>
          <Tooltip title={`${user?.fullname.split(" ")[0]}`}>
            <Icons onClick={handleClick}>
              <Avatar
                onClick={() => {}}
                sx={{ width: "40px", height: "40px" }}
                src=""
              />
            </Icons>
          </Tooltip>
          <UserBox>
            <Avatar
              onClick={() => {}}
              sx={{ width: "40px", height: "40px" }}
              src={`${user?.image}`}
            />
            <Typography variant="body2">
              {user?.fullname.split(" ")[0]}
            </Typography>
          </UserBox>
        </StyledToolbar>
        {/* <Box onClick={handleClick}> */}
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => {}}>Minha conta</MenuItem>
          <MenuItem onClick={() => onLogout()}>Terminar a sessão</MenuItem>
          <MenuItem onClick={() => {}}>Configurações</MenuItem>
        </Menu>
        {/* </Box> */}
      </AppBar>
    </Box>
  );
};

export default Navbar;
