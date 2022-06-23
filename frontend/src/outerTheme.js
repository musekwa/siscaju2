import { createTheme } from "@mui/material";
import { orange } from "@mui/material/colors";


export const outerTheme = createTheme({
  status: {
    danger: orange[500],
  },
  palette: {
    rebecca: {
      main: "#663399",
    },
    white: {
      main: "#FFF",
    }
  },
});
