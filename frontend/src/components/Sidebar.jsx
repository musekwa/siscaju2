import { Dashboard, Forest, LegendToggle, PersonAdd } from "@mui/icons-material";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"



const Sidebar = () => {
  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position={"fixed"}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#dashboard">
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Meu Painel" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#registar-produtor">
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Registar Produtor" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#registar-pomar">
              <ListItemIcon>
                <Forest />
              </ListItemIcon>
              <ListItemText primary="Registar Pomar" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#monitorar-pomar">
              <ListItemIcon>
                <LegendToggle />
              </ListItemIcon>
              <ListItemText primary="Monitorar Pomar" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar