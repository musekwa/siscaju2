import { Add } from "@mui/icons-material";
import { Fab, Tooltip } from "@mui/material";
import React from "react";

const AddButton = (onClick) => {
  return (
    <Tooltip
      onClick={() => {}}
      title="Registar Produtor"
      sx={{
        position: "fixed",
        backgroundColor: "rebeccapurple",
        bottom: 60,
        left: { xs: 300, md: 30 },
      }}
    >
        <Fab color="primary" aria-label="add">
            <Add />
        </Fab>
    </Tooltip>
  );
};

export default AddButton;
