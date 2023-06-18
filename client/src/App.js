import React, { useState, lazy, useEffect, Suspense } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// contexts
import AppContext from "./contexts/AppContext";
// constants
import { COMPANY } from "./constants/variables";
import { AUTH_TOKEN_ENDPOINT } from "./constants/endpoints";
import { categories } from "./constants/data";
// mui
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
// components
import Loader from "./components/Loader";
// pages
const Auth = lazy(() => import("./pages/auth/Auth"));
const Home = lazy(() => import("./pages/home/Index"));
const Dashboard = lazy(() => import("./pages/dashboard/Index"));

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [mode, setMode] = useState("light");
  const [category, setCategory] = useState(categories[0]?.title || "");

  useEffect(() => {
    // fetch local data
    const localData = JSON.parse(localStorage.getItem(COMPANY));
    // set user
    const token = localData?.token;
    if (token) {
      try {
        axios.post(AUTH_TOKEN_ENDPOINT, { token })
          .then(res => {
            setUser(res.data.user || null);
          })
          .catch(err => {
            setUser(null);
          });
      } catch (err) {
        setUser(null);
      };
    }
    else
      setUser(null);
    // set mode - dark/light
    const mode = localData?.mode || "light";
    setMode(mode);
  }, []);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, [location]);

  const theme = createTheme({ palette: { mode } });

  const isProfileComplete = user => user && user.name && user.email && user.contact && user.address1 && user.city && user.state && user.country && user.zip && user.location?.coordinates?.length;

  const handleMode = mode => {
    const localData = JSON.parse(localStorage.getItem(COMPANY)) || {};
    localStorage.setItem(COMPANY, JSON.stringify({ ...localData, mode }));
    setMode(mode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet><title>{COMPANY}</title></Helmet>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AppContext.Provider value={{ user, setUser, mode, handleMode, category, setCategory, isProfileComplete }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path={"/dashboard/*"} element={user ? <Dashboard /> : <Navigate to={"/auth"} />} />
              <Route path={"/auth/*"} element={!(user && user.email) ? <Auth /> : <Navigate to={"/*"} />} />
              <Route path={"/*"} element={<Home />} />
            </Routes>
          </Suspense>
        </AppContext.Provider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;