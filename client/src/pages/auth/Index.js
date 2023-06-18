import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
// pages
const AuthUser = lazy(() => import("./AuthUser"));
const AuthVendor = lazy(() => import("./AuthVendor"));
const AuthAdmin = lazy(() => import("./AuthAdmin"));

const Auth = () => {
  return (
    <Routes>
      <Route path="/user/*" element={<AuthUser />} />
      <Route path="/vendor/*" element={<AuthVendor />} />
      <Route path="/admin/*" element={<AuthAdmin />} />
      <Route path="/*" element={<AuthUser />} />
    </Routes>
  );
};

export default Auth;
