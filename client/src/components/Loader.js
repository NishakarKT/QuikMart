import React from "react";
// mui
import { Container } from "@mui/material";
import { CircularProgress } from "@mui/material";

const Loader = () => {
    return (
        <Container sx={{ position: "fixed", width: "100vw", height: "100vh", zIndex: 10000, display: "grid", placeItems: "center" }}>
            <CircularProgress />
        </Container>
    );
};

export default Loader;