// import { Forest, LegendToggle, PersonAdd } from "@mui/icons-material";
// import { Box, Divider, Paper, Stack, styled, Typography } from "@mui/material";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
// import Monitorings from './Monitorings'
// import Dashboard from './dashboard/Dashboard'
// import Farmlands from './farmlands/Farmlands'
// import Farmers from './farmers/Farmers'
// import { farmers } from "../fakeData/farmers";
// import { farmlands } from "../fakeData/farmlands";
// import { useRef, useState, useEffect } from "react";


// const Item = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

// const Home = () => {

//  const [value, setValue] = useState(0);

//  const ref = useRef(null);
//  const [itemList, setItemList] =  useState([]) // useState(() => refreshMessages());

//  useEffect(() => {
//   //  ref.current.ownerDocument.body.scrollTop = 0;
//    if (value === 2) {
//     setItemList(farmers);
//    }
//    else if (value === 3) {
//     setItemList(farmlands);
//    }
   
//  }, [value, setItemList]);



//   return (
//     <>
//     <h1>Home</h1>
//     {/* <Farmers itemList={itemList} /> */}
//     {/* <Footer value setValue />
//       {
//         value === 0 ?
//         <Dashboard />
//         : value === 1 ?
//         <Monitorings />
//         : value === 2 ?
//         <Farmers value={value} itemList={itemList} /> 
//         : value === 3 ?
//         <Farmlands /> 
//         : null
//       } */}
//       <Footer />
//     </>
//     // <Box sx={{ width: "100%", pt: "20px"}}>
//     //   <Navbar />
//     //  <Box>
//     //   {/* <Box sx={{ maxWidth: "960px", display: "flex", justifyContent: "center"}}> */}
//     //   <Stack direction="row"  spacing={{ xs: 2, sm: 6, md: 8 }} sx={{ display: "flex", justifyContent: "center", marginTop: "30px", }} >
//     //     <Item component="a" href="#adicionar-produtor">
//     //       <PersonAdd fontSize="large" sx={{ color: "rebeccapurple" }}  />
//     //       <Typography variant="body1" sx={{ color: "rebeccapurple" }}>Adicionar<br />Produtor</Typography>
//     //     </Item>
//     //     <Item component="a" href="#adicionar-produtor">
//     //       <Forest fontSize="large" sx={{ color: "rebeccapurple" }} />
//     //      <Typography variant="body1" sx={{ color: "rebeccapurple" }}>Registar<br />Pomar</Typography>
//     //     </Item>
//     //     <Item component="a" href="#adicionar-produtor">
//     //       <LegendToggle fontSize="large" sx={{ color: "rebeccapurple" }}  />
//     //       <Typography variant="body1" sx={{ color: "rebeccapurple" }}>Monitorar<br />Pomar</Typography>
//     //     </Item>
//     //   </Stack>
//     //   {/* </Box> */}

//     //   <Divider sx={{ marginTop: "30px"  }} />
//     //   {/* <Box sx={{ maxWidth: "960px", display: "flex", justifyContent: "center", textAlign: "center"}}> */}
//     //   <Stack direction="row"  sx={{ display: "flex", justifyContent: "space-around",  margin: "5px 10px 10px 10px"  }} >
//     //     <Typography variant="body1">Desempenho pessoal</Typography>
//     //      <Typography component="a" hrf="#desempenho-pessoal" variant="body2" sx={{ color: "rebeccapurple" }} >ver mais</Typography>
//     //   </Stack>
//     //   <Stack direction="row" spacing={{ xs: 2, sm: 6, md: 8 }} sx={{ display: "flex", justifyContent: "center", }} >
//     //     <Item component="a" href="#adicionar-produtor">
//     //       <Typography sx={{  }} >{0}</Typography>
//     //       <Typography variant="body1" sx={{ }}>Produtores<br />registados</Typography>
//     //     </Item>
//     //     <Item component="a" href="#adicionar-pomar">
//     //        <Typography sx={{  }} >{0}</Typography>
//     //      <Typography variant="body1" sx={{  }}>Pomares<br />registados</Typography>
//     //     </Item>
//     //     <Item component="a" href="#monitorar-pomar">
//     //        <Typography sx={{  }} >{0}</Typography>
//     //       <Typography variant="body1" sx={{  }}>Pomares<br />monitorados</Typography>
//     //     </Item>
//     //   </Stack>
//     //   {/* </Box> */}

//     //   <Divider sx={{ marginTop: "30px", display: "flex", justifyContent: "center"  }} />
//     //   {/* <Box sx={{ maxWidth: "960px"}}> */}
//     //   <Stack direction="row"  sx={{ display: "flex", justifyContent: "space-around",  margin: "5px 10px 10px 10px"  }} >
//     //     <Typography variant="body1">Desempenho distrital</Typography>
//     //      <Typography component="a" hrf="#desempenho-distrital" variant="body2" sx={{ color: "rebeccapurple" }} >ver mais</Typography>
//     //   </Stack>
//     //   <Stack direction="row"  spacing={{ xs: 2, sm: 6, md: 8 }} sx={{ display: "flex", justifyContent: "center", }} >
//     //     <Item component="a" href="#adicionar-produtor">
//     //       <Typography sx={{  }} >{0}</Typography>
//     //       <Typography variant="body1" sx={{ }}>Produtores<br />registados</Typography>
//     //     </Item>
//     //     <Item component="a" href="#adicionar-produtor">
//     //        <Typography sx={{  }} >{0}</Typography>
//     //      <Typography variant="body1" sx={{  }}>Pomares<br />registados</Typography>
//     //     </Item>
//     //     <Item component="a" href="#adicionar-produtor">
//     //        <Typography sx={{  }} >{0}</Typography>
//     //       <Typography variant="body1" sx={{  }}>Pomares<br />monitorados</Typography>
//     //     </Item>
//     //   </Stack>
//     //   {/* </Box> */}
//     //   </Box>
//     //   <Footer />
//     // </Box>
//   );
// };

// export default Home;
