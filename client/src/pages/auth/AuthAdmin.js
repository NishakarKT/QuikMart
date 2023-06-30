import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { Helmet } from "react-helmet";
// firebase
import { auth, googleProvider } from "../../firebase";
// mui
import {
  Container,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Typography,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import {
  AccountCircle,
  Key,
  Login,
  LockOpen,
  LightMode,
  DarkMode,
  Home,
  StarBorder,
  LocalShipping,
  Google,
} from "@mui/icons-material";
// contexts
import AppContext from "../../contexts/AppContext";
// constants
import { COMPANY, COMPANY2 } from "../../constants/variables";
import { HOME_ROUTE, AUTH_USER_ROUTE, ADMIN_ROUTE, AUTH_VENDOR_ROUTE } from "../../constants/routes";
import { AUTH_IN_ENDPOINT, AUTH_OTP_GENERATE_ENDPOINT, AUTH_OTP_VERIFY_ENDPOINT } from "../../constants/endpoints";
import { IMAGES_WEBSITE_LOGO_BLACK_PNG, IMAGES_WEBSITE_LOGO_WHITE_PNG } from "../../constants/images";
import { VIDEOS_AUTH_ADMIN_MP4 } from "../../constants/videos";
// styles
const useStyles = makeStyles({
  container: {
    maxWidth: "100% !important",
    height: "100vh",
    overflow: "hidden",
  },
  homeBtn: {
    position: "fixed",
    top: "16px",
    right: "16px",
  },
  stack: {
    position: "relative",
    height: "100vh",
    overflowX: "hidden",
    overflowY: "auto",
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "lightgray" },
  },
  carousel: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    userSelect: "none",
  },
  carouselItem: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  carouselItemImg: {
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    filter: "brightness(0.25)",
  },
  carouselItemDetails: {
    position: "fixed",
    bottom: "0",
    width: "100%",
    userSelect: "text",
  },
  logo: {
    width: "50px",
    height: "50px",
  },
  avatar: {
    border: "2px solid white",
    transition: "all 0.2s",
    "&:hover": {
      bgcolor: "lightgray",
      transform: "scale(1.1)",
    },
  },
  category: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const AuthAdmin = () => {
  const role = "admin";
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { users, setUsers, setRole, mode, handleMode } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGglLoading, setIsGglLoading] = useState(false);
  const [remMe, setRemMe] = useState(true);
  const [emailErr, setEmailErr] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const user = users.find((user) => user.role === role) || {};
    if (user.email) {
      if (location.key) navigate(-1);
      else navigate(ADMIN_ROUTE);
    }
  }, [users, role, navigate, location.key]);

  useEffect(() => {
    setRole(role);
  }, [role, setRole]);

  const handleGoogleAuth = () => {
    setIsGglLoading(true);
    auth
      .signInWithPopup(googleProvider)
      .then((res) => {
        const email = res.user.email;
        axios
          .post(AUTH_IN_ENDPOINT, { email, role })
          .then((res) => {
            const { users, token } = res.data;
            // storing token
            if (remMe) {
              const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
              localStorage.setItem(COMPANY, JSON.stringify({ ...localData, token }));
            } else {
              const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
              delete localData.token;
              localStorage.setItem(COMPANY, JSON.stringify(localData));
            }
            // setting user
            setUsers(users);
            // back to home
            navigate(ADMIN_ROUTE);
            // resets
            setIsGglLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setEmailErr(err.response.data.message || "Something went wrong!");
            setIsGglLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setEmailErr(err.message || "Something went wrong!");
        setIsGglLoading(false);
      });
  };

  const generateOtp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    if (!validator.isEmail(email)) setEmailErr("Please, provide a valid email addess.");
    else {
      try {
        setIsLoading(true);
        axios
          .post(AUTH_OTP_GENERATE_ENDPOINT, { email })
          .then((res) => {
            const { token } = res.data;
            // storing token
            const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
            localStorage.setItem(COMPANY, JSON.stringify({ ...localData, token }));
            // open otp form
            setIsOtpSent(true);
            // resets
            setIsLoading(false);
            setEmailErr("");
          })
          .catch((err) => {
            //resets
            setIsLoading(false);
            setEmailErr(err.response.data.message || "Something went wrong!");
          });
      } catch (err) {
        // resets
        setIsLoading(false);
        setEmailErr("Something went wrong! Try refreshing.");
      }
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const otp = formData.get("otp");
    const token = JSON.parse(localStorage.getItem(COMPANY))?.token;
    if (!otp) setOtpErr("Please, provide the One Time Password (OTP).");
    else if (!email || !token) {
      setEmailErr("Please, provide your email addess.");
      setIsOtpSent(false);
    } else {
      try {
        setIsLoading(true);
        axios
          .post(AUTH_OTP_VERIFY_ENDPOINT, { otp, email, token })
          .then(async (res) => {
            if (res.data.verified) {
              // OTP is verified
              axios
                .post(AUTH_IN_ENDPOINT, { email, role })
                .then((res) => {
                  const { users, token } = res.data;
                  // storing token
                  if (remMe) {
                    const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
                    localStorage.setItem(COMPANY, JSON.stringify({ ...localData, token }));
                  } else {
                    const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
                    delete localData.token;
                    localStorage.setItem(COMPANY, JSON.stringify(localData));
                  }
                  // setting user
                  setUsers(users);
                  // resets
                  setIsLoading(false);
                  setOtpErr("");
                  navigate(ADMIN_ROUTE);
                })
                .catch((err) => {
                  // resets
                  console.log(err);
                  setIsLoading(false);
                  setOtpErr(err.response.data.message || "Something went wrong!");
                });
            } else {
              // resets
              setIsLoading(false);
              setOtpErr("OTP is invalid. Try again.");
            }
          })
          .catch((err) => {
            // resets
            setIsLoading(false);
            setOtpErr(err.message || "Something went wrong!");
          });
      } catch (err) {
        // resets
        setIsLoading(false);
        console.log(err.message);
        setOtpErr("Something went wrong! Try refreshing.");
      }
    }
  };

  return (
    <Container disableGutters className={classes.container}>
      <Helmet>
        <title>Auth | User | {COMPANY}</title>
      </Helmet>
      <SpeedDial
        sx={{ position: "fixed", bottom: 0, right: 0, zIndex: 3, p: 2 }}
        icon={<SpeedDialIcon />}
        direction={"up"}
        ariaLabel="SpeedDial playground example"
      >
        {mode !== "light" ? <SpeedDialAction onClick={() => handleMode("light")} icon={<LightMode />} tooltipTitle={"Light Mode"} /> : null}
        {mode !== "dark" ? <SpeedDialAction onClick={() => handleMode("dark")} icon={<DarkMode />} tooltipTitle={"Dark Mode"} /> : null}
      </SpeedDial>
      <Stack direction="row" className={classes.stack}>
        <Stack sx={{ position: "relative", height: "100vh", display: { xs: "none", sm: "flex" } }} justifyContent="flex-end" flex={2}>
          <video
            style={{ position: "absolute", zIndex: "-1", width: "100%", height: "100%", objectFit: "cover" }}
            src={VIDEOS_AUTH_ADMIN_MP4}
            muted
            autoPlay
            loop
          ></video>
          <Stack justifyContent="flex-end" sx={{ height: "100%", backgroundColor: "rgba(0, 0, 255, 0.4)" }}>
            <Stack p={2} spacing={2} sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <Typography color="white" variant="h4">
                Empowering Admins for Effortless Control!
              </Typography>
              <List disablePadding>
                <ListItem disableGutters disablePadding>
                  <ListItemIcon>
                    <StarBorder sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Features designed to streamline and simplify administrative tasks." />
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <ListItemIcon>
                    <StarBorder sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Gain valuable insights into your ecommerce operations." />
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <ListItemIcon>
                    <StarBorder sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Assign specific roles and access levels to different individuals." />
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <ListItemIcon>
                    <StarBorder sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: "white" }}
                    primary="Your data and sensitive information are protected through robust security measures."
                  />
                </ListItem>
              </List>
              <Stack direction="row" spacing={1}>
                <Button onClick={() => navigate(HOME_ROUTE)} variant="contained" startIcon={<Home />}>
                  Home
                </Button>
                <Button onClick={() => navigate(AUTH_USER_ROUTE)} variant="contained" color="success" startIcon={<AccountCircle />}>
                  User
                </Button>
                <Button onClick={() => navigate(AUTH_VENDOR_ROUTE)} variant="contained" color="warning" startIcon={<LocalShipping />}>
                  Vendor
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack flex={1} px={2} spacing={2} justifyContent="center" maxWidth="sm" className={classes.stack}>
          <Stack direction="row">
            <img
              className={classes.logo}
              src={mode === "dark" ? IMAGES_WEBSITE_LOGO_WHITE_PNG : IMAGES_WEBSITE_LOGO_BLACK_PNG}
              alt={"logo"}
              loading="lazy"
            />
            <Stack sx={{ userSelect: "none", ml: 1 }}>
              <Typography variant="h5" align="left">
                {COMPANY}{" "}
                <Typography component="span" color="primary" variant="body2" sx={{ fontWeight: "bold" }}>
                  for Admins
                </Typography>
              </Typography>
              <Typography variant="body1" align="left" gutterBottom>
                {COMPANY2}
              </Typography>
            </Stack>
          </Stack>
          <form onSubmit={(e) => (!isOtpSent ? generateOtp(e) : verifyOtp(e))}>
            <Stack>
              <TextField
                variant="standard"
                label="Email"
                name="email"
                error={Boolean(emailErr)}
                helperText={emailErr || "Lets begin with you email address!"}
                inputProps={{ readOnly: isOtpSent }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              {isOtpSent ? (
                <TextField
                  variant="standard"
                  label="One Time Password (OTP)"
                  name="otp"
                  error={Boolean(otpErr)}
                  helperText={otpErr || "Enter the OTP sent to above email address."}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="OTP">
                          <Key />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : null}
              <FormControlLabel
                sx={{ mb: 1 }}
                control={<Checkbox checked={remMe} onChange={(e, val) => setRemMe(val)} />}
                label="Remember Me?"
              />
              <LoadingButton type="submit" variant="contained" loading={isLoading} endIcon={!isOtpSent ? <Login /> : <LockOpen />}>
                {!isOtpSent ? "Login" : "Verify"}
              </LoadingButton>
            </Stack>
          </form>
          <Divider sx={{ "&::before": { top: 0 }, "&::after": { top: 0 } }}>
            <Chip label="OR" />
          </Divider>
          <Stack justifyContent="center" direction="row">
            <LoadingButton loading={isGglLoading} fullWidth variant="outlined" onClick={handleGoogleAuth} startIcon={<Google />}>
              Sign In With Google
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthAdmin;