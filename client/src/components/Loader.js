import React from "react";
// mui
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0, 
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10000,
        display: "grid",
        placeItems: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
