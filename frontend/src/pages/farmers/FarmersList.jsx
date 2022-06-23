
import React, {Fragment, startTransition } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Navbar from '../../components/Navbar';
import { Box, Fab, Stack, Tooltip } from '@mui/material';
import Footer from '../../components/Footer';
import { Add } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import SearchModal from '../../components/SearchModal';
import { useGetFarmersByQuery } from '../../features/api/apiSlice'


const FarmersList = ({ user })=> {

    let filterBy = user?.role === 'Extensionista' 
                    ? user?.address?.district 
                    : user?.role === 'Gestor' 
                    ? user?.address?.province
                    : user?.role === 'Produtor'
                    ? user?.address?.territory : null;
    let { data: farmers, isLoading } = useGetFarmersByQuery(filterBy, {
        fixedCaheKey: 'farmers'
    });

    const navigate = useNavigate()
    // const location = useLocation()

    const onAddFarmer = ()=>{
        startTransition(()=>{
        navigate('/farmers')
    })}


    const GetTotalTrees = (farmlands) => {
        // get all the declared areas for all the farmlands
        let trees = farmlands?.map(f=>f?.totalTrees)
       
        return trees.reduce((ac, el)=>ac + el, 0);
    }

    const normalizeDate = (date)=>{
        return new Date(date).getDate() + '/'
             + (new Date(date).getMonth() + 1) + '/' 
             + new Date(date).getFullYear()
    }

    if (isLoading) {
      return <Spinner />;
    }

  return (
    <Box>
        <Navbar pageDescription={user?.address?.district} isManageSearch={true} isSearchIcon={true} user={user} />
        <Tooltip onClick={onAddFarmer} title="Adicine produtor" sx={{ position: "fixed", bottom: 60, right: 25 }}>
            <Fab  aria-label="add" color="rebecca">
                <Add fontSize='large' color="white" />
            </Fab>
        </Tooltip>
        {
            (farmers && farmers.length === 0) && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center ", width: "100%", height: "90vh", }}>
                    <Box sx={{ width: "600px"}}>
                    <Typography>Nenhum produtor deste distrito foi registado!</Typography>
                    </Box>
                </Box>
            )
        }
        <List sx={{ marginTop: "45px", width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                farmers?.map((farmer, key)=>(
            <Box key={farmer._id.toString()} >
            <Link to="/farmer" state={{ farmer }}>
            <ListItem alignItems="flex-start" >
                {/* <ListItemButton> */}
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp"  />
                </ListItemAvatar>
                <ListItemText
                    primary= {
                        <Fragment>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "gray"}}  >{`${farmer?.fullname}` } <span style={{ fontSize: "12px"}}>{`(${new Date().getFullYear() - new Date (farmer.birthDate).getFullYear()} anos)`}</span></Typography>
                            <Typography component="span" sx={{ fontSize: "11px", }}>{farmer?.category} (em {`${farmer?.address?.territory}`})</Typography>
                            <Stack direction="row">
                                <Box sx={{ width: "50%"}}>
                                    <Typography component="span" variant='body2'>{`Pomares: ${farmer?.farmlands?.length}`}</Typography>
                                </Box>
                                <Box sx={{ width: "50%"}}>
                                 <Typography component="span" variant='body2'>Cajueiros: {GetTotalTrees(farmer?.farmlands)}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row">
                                <Box sx={{ width: "50%"}}>
                                 <Typography component="div" sx={{ fontSize: "11px", textAlign: "left"}}>{`${farmer.phone ? farmer.phone : "Não tem telefone"}`}</Typography> 
                                </Box>
                               
                            </Stack>
                        </Fragment>
                    }
                    secondary={
                        
                        <Typography component="div" sx={{ width: "100%"}}><span style={{textAlign: "rigth", fontSize: "11px"}}>Registo:{`${normalizeDate(farmer.createdAt)}`}</span>   <span style={{textAlign: "rigth", fontSize: "11px"}}>{`por ${farmer?.user?.fullname}`}</span></Typography> 
                    }
                />
                {/* </ListItemButton> */}
            </ListItem>
            </Link>
            <Divider variant="inset" component="li" />
            </Box>))
            }
        </List>
        <SearchModal open={false} />
        <Footer />
    </Box>
  );
}


export default FarmersList