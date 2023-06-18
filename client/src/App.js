import React, { useState, lazy, useEffect, Suspense } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// contexts
import AppContext from "./contexts/AppContext";
// constants
import { COMPANY } from "./constants/variables";
import { AUTH_TOKEN_ENDPOINT } from "./constants/endpoints";
import { categories } from "./constants/data";
// mui
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// components
import Loader from "./components/Loader";
// pages
const Auth = lazy(() => import("./pages/auth/Index"));
const Home = lazy(() => import("./pages/home/Index"));
const Dashboard = lazy(() => import("./pages/dashboard/Index"));
const Admin = lazy(() => import("./pages/admin/Index"));

const App = () => {
  const location = useLocation();
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("light");
  const [category, setCategory] = useState(categories[0]?.title || "");

  useEffect(() => {
    // fetch local data
    const localData = JSON.parse(localStorage.getItem(COMPANY));
    // set user
    const token = localData?.token;
    if (token) {
      try {
        axios
          .post(AUTH_TOKEN_ENDPOINT, { token })
          .then((res) => {
            const users = res.data.users || [];
            setUsers(users);
          })
          .catch((err) => {
            setUsers([]);
          });
      } catch (err) {
        setUsers([]);
      }
    } else setUsers([]);
    // set mode - dark/light
    const mode = localData?.mode || "light";
    setMode(mode);
  }, []);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, [location]);

  const theme = createTheme({ palette: { mode } });

  const isProfileComplete = (user) =>
    user &&
    user.name &&
    user.email &&
    user.contact &&
    user.address1 &&
    user.city &&
    user.state &&
    user.country &&
    user.zip &&
    user.location?.coordinates?.length;

  const handleMode = (mode) => {
    const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
    localStorage.setItem(COMPANY, JSON.stringify({ ...localData, mode }));
    setMode(mode);
  };

  useEffect(() => console.log(users), [users]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <title>{COMPANY}</title>
      </Helmet>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AppContext.Provider value={{ users, setUsers, role, setRole, mode, handleMode, category, setCategory, isProfileComplete }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path={"/admin/*"} element={<Admin />} />
              <Route path={"/dashboard/*"} element={<Dashboard />} />
              <Route path={"/auth/*"} element={<Auth />} />
              <Route path={"/*"} element={<Home />} />
            </Routes>
          </Suspense>
        </AppContext.Provider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
