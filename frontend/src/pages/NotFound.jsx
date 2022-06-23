

import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import Footer from '../components/Footer'

const NotFound = () => {
  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>

        <Stack sx={{  width: "300px", color: "rebeccapurple", border: "1px solid rebeccapurple", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px"}}>
            <Typography variant="h6" sx={{ color: "red"}}>404 Not Found!</Typography>
            <Typography variant="h6" sx={{  }}>Ainda estamos a trabalhar sobre isto!</Typography>
        </Stack>
        <Footer />
    </Box>
  )
}

export default NotFound