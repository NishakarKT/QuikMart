import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// mui
import { Stack, Typography, Grid, TextField, Button, Box, Toolbar, Paper, Autocomplete } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { SyncAlt } from "@mui/icons-material";
// contexts
import AdminContext from "../../contexts/AdminContext";
// constants
import { AUTH_ADMIN_ROUTE, PROFILE_ROUTE } from "../../constants/routes";
import { ADMIN_NEW_DOCUMENT_ENDPOINT } from "../../constants/endpoints";
// components
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

const NewDocuments = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { user, isProfileComplete, documents, collections, collection, setCollection } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_ADMIN_ROUTE);
  }, [user, navigate]);

  const handleNewDocument = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => (data[key] = value));
    try {
      setIsLoading(true);
      axios
        .post(ADMIN_NEW_DOCUMENT_ENDPOINT, { name: collection, data })
        .then((res) => {
          alert(data.title + " uploaded successfully!");
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      {isLoading ? <Loader /> : null}
      <Toolbar />
      {isProfileComplete(user) ? (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  New Document
                </Typography>
                <Autocomplete
                  disablePortal
                  sx={{ minWidth: 200 }}
                  options={collections}
                  value={collection}
                  onChange={(e, value) => setCollection(value)}
                  renderInput={(params) => <TextField {...params} label="Search Collections" />}
                />
              </Stack>
              <form onSubmit={handleNewDocument} ref={formRef}>
                <Grid container spacing={2}>
                  {documents.length &&
                    Object.keys(documents[0]).map((key) => (
                      <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                        <TextField multiline maxRows={4} name={key} label={key} fullWidth variant="outlined" />
                      </Grid>
                    ))}
                </Grid>
                <Stack spacing={2} direction="row" justifyContent={"space-between"} sx={{ display: "flex", mt: 2 }}>
                  <LoadingButton loading={isLoading} type="submit" variant="contained" startIcon={<SyncAlt />}>
                    Upload
                  </LoadingButton>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
          <Typography component="p" variant="h4" align="center" color="error">
            Profile Incomplete!
          </Typography>
          <Typography component="p" variant="body1" align="center" color="text.secondary">
            Update your profile with all the necessary details to become a document/service provider!
          </Typography>
          <Button onClick={() => navigate(PROFILE_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
            Update Profile
          </Button>
        </Stack>
      )}
      <Footer />
    </Box>
  );
};

export default NewDocuments;
