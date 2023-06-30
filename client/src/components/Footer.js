import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// constants
import { COMPANY, COMPANY2 } from "../constants/variables";
import { IMAGES_WEBSITE_LOGO_WHITE_PNG } from "../constants/images";
import { HOME_ROUTE } from "../constants/routes";
import { CONTACT_FB_URL, CONTACT_IN_URL, CONTACT_IG_URL, CONTACT_EM_URL } from "../constants/urls";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Grid, Stack, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import { Facebook, LinkedIn, Instagram, AlternateEmail, Home } from "@mui/icons-material";

const Footer = ({ sx }) => {
  const navigate = useNavigate();
  const { mode } = useContext(AppContext);
  return (
    <Stack component="footer" color="white" bgcolor={mode === "dark" ? "#272727" : "primary.main"} p={2} spacing={2} sx={sx}>
      <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <img style={{ width: "60px", height: "60px" }} src={IMAGES_WEBSITE_LOGO_WHITE_PNG} alt={"logo"} loading="lazy" />
          <Stack sx={{ userSelect: "none", ml: 1 }}>
            <Typography variant="h4" align="left">
              {COMPANY}
            </Typography>
            <Typography variant="body1" align="left" gutterBottom>
              {COMPANY2}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" spacing={1}>
          <Typography variant="h4" whiteSpace="nowrap">
            Connect{" "}
            <Typography variant="span" sx={{ fontSize: "16px", fontWeight: "500" }}>
              With
            </Typography>{" "}
            Us
          </Typography>
          <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1}>
            <Tooltip title="Facebook">
              <IconButton onClick={() => window.open(CONTACT_FB_URL)} sx={{ width: 50, height: 50, color: "white" }}>
                <Facebook fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Linkedin">
              <IconButton onClick={() => window.open(CONTACT_IN_URL)} sx={{ width: 50, height: 50, color: "white" }}>
                <LinkedIn fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Instagram">
              <IconButton onClick={() => window.open(CONTACT_IG_URL)} sx={{ width: 50, height: 50, color: "white" }}>
                <Instagram fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email">
              <IconButton onClick={() => window.open(CONTACT_EM_URL)} sx={{ width: 50, height: 50, color: "white" }}>
                <AlternateEmail fontSize="large" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Grid container>
        <Grid item xs={12} md={9} sx={{ pl: { xs: 1, md: 2 } }}>
          <Typography gutterBottom variant="h5">
            About Us
          </Typography>
          <Typography variant="body2" gutterBottom>
            Welcome to {COMPANY}, your one-stop destination for all your online shopping needs. Discover an extensive range of high-quality
            products at unbeatable prices.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }} gutterBottom>
            From electronics and fashion to home essentials and more, we've got you covered.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Enjoy a seamless shopping experience with secure payments, fast shipping, and excellent customer support. Shop smart, shop{" "}
            {COMPANY}.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography gutterBottom variant="h5" sx={{ ml: { xs: 1, md: 2 } }}>
              Lost ?
            </Typography>
            <Stack
              onClick={() => navigate(HOME_ROUTE)}
              direction="row"
              alignItems="center"
              sx={{
                ml: { xs: 0, md: 1 },
                p: 1,
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
              }}
            >
              <Home sx={{ mr: 1 }} />
              <Typography>Home</Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Divider />
      <Typography align="center">
        Copyright © {COMPANY} {new Date().getFullYear()}
      </Typography>
    </Stack>
  );
};

export default Footer;
