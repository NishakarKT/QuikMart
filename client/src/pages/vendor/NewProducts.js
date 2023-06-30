import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
// contexts
import AppContext from "../../contexts/AppContext";
// mui
import {
  Stack,
  Typography,
  Grid,
  TextField,
  Fab,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  Box,
  Toolbar,
  Switch,
  FormGroup,
  Paper,
  FormControlLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Close, Add, SyncAlt } from "@mui/icons-material";
// contexts
import VendorContext from "../../contexts/VendorContext";
// constants
import { AUTH_VENDOR_ROUTE, VENDOR_PROFILE_ROUTE } from "../../constants/routes";
import { PRODUCT_NEW_PRODUCT_ENDPOINT, FILE_NEW_FILES_ENDPOINT } from "../../constants/endpoints";
import { categories, currencies } from "../../constants/data";
// components
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
// vars
const product = {
  title: "Sample Product",
  category: categories[0],
  desc: "A good description attracts more customers!",
  price: 99,
  deal: "10% OFF",
  availability: "true",
  files: [],
};

const NewProducts = () => {
  const formRef = useRef(null);
  const filesRef = useRef(null);
  const navigate = useNavigate();
  const { mode } = useContext(AppContext);
  const { user, isProfileComplete } = useContext(VendorContext);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_VENDOR_ROUTE);
  }, [user, navigate]);

  const handleNewProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {},
      formData = new FormData(form);
    const now = Date.now();
    formData.forEach((value, key) => (data[key] = value));
    const updatedFiles = files.map(
      (file, index) => new File([file], user.role + "." + user.email + "." + now + "." + index + "." + file.name.split(".").at(-1), { type: file.type })
    );
    data["files"] = updatedFiles.map((file) => file.name);
    data["owner"] = user._id;
    data["ownerName"] = user.name;
    data["ownerProfilePic"] = user.profilePic;
    data["availability"] = data["availability"] === "on";
    try {
      setIsLoading(true);
      axios
        .post(PRODUCT_NEW_PRODUCT_ENDPOINT, data)
        .then((res) => {
          if (updatedFiles.length) {
            try {
              const filesData = new FormData();
              updatedFiles.forEach((updatedFile) => filesData.append("files", updatedFile));
              axios.post(FILE_NEW_FILES_ENDPOINT, filesData).then((res) => {
                alert(data.title + " uploaded successfully!");
                setFiles([]);
                setIsLoading(false);
              });
            } catch (err) {
              setIsLoading(false);
            }
          } else {
            alert(data.title + " uploaded successfully!");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (file) => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length) setFiles((files) => [...files, ...newFiles]);
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
              <Stack direction="row" spacing={2}>
                <Stack
                  flex={{ xs: 0, md: 1 }}
                  justifyContent="center"
                  sx={{ position: "relative", backgroundColor: mode === "dark" ? "black" : "lightgray" }}
                >
                  <input ref={filesRef} accept="image/*" onChange={handleFiles} name="files" type="file" multiple hidden />
                  <Fab
                    onClick={() => filesRef.current?.click()}
                    sx={{ position: "absolute", bottom: 16, right: 16 }}
                    color="primary"
                    aria-label="add"
                  >
                    <Add />
                  </Fab>
                  <Carousel stopOnHover={false} showStatus={false} showThumbs={false}>
                    {files.map((file) => (
                      <div key={URL.createObjectURL(file)} style={{ position: "relative" }}>
                        <Fab onClick={() => handleDelete(file)} sx={{ position: "absolute", top: 8, right: 8 }} size="small" color="error">
                          <Close fontSize="medium" />
                        </Fab>
                        <img style={{ width: "100%" }} src={URL.createObjectURL(file)} alt="" loading="lazy" />
                      </div>
                    ))}
                  </Carousel>
                </Stack>
                <Stack flex={2} sx={{ width: "100%", overflowX: "hidden", overflowY: "auto" }}>
                  <Grid item xs={12} mb={{ xs: 5, md: 0 }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      New Product
                    </Typography>
                    <Stack
                      display={{ xs: "flex", md: "none" }}
                      justifyContent="center"
                      sx={{ position: "relative", backgroundColor: mode === "dark" ? "black" : "lightgray", minHeight: "200px", mb: 2 }}
                    >
                      <Fab
                        onClick={() => filesRef.current?.click()}
                        sx={{ position: "absolute", bottom: 16, right: 16 }}
                        color="primary"
                        aria-label="add"
                      >
                        <Add />
                      </Fab>
                      <Carousel stopOnHover={false} showStatus={false} showThumbs={false}>
                        {files.map((file) => (
                          <div key={URL.createObjectURL(file)} style={{ position: "relative" }}>
                            <Fab
                              onClick={() => handleDelete(file)}
                              sx={{ position: "absolute", top: 8, right: 8 }}
                              size="small"
                              color="error"
                            >
                              <Close fontSize="medium" />
                            </Fab>
                            <img style={{ width: "100%" }} src={URL.createObjectURL(file)} alt="" loading="lazy" />
                          </div>
                        ))}
                      </Carousel>
                    </Stack>
                    <form onSubmit={handleNewProduct} ref={formRef}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField required name="title" label="Title" fullWidth variant="standard" defaultValue={product["title"]} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                              Category
                            </InputLabel>
                            <NativeSelect defaultValue={categories[0]} inputProps={{ name: "category", id: "uncontrolled-native" }}>
                              {categories.map((category) => (
                                <option key={"Dashboard_NewProduct_category_" + category.title} value={category.title}>
                                  {category.title}
                                </option>
                              ))}
                            </NativeSelect>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            multiline
                            fullWidth
                            placeholder="A good description attracts more customers!"
                            label="Description"
                            name="desc"
                            rows={5}
                            defaultValue={product["desc"]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            required
                            name="price"
                            label="Price"
                            fullWidth
                            variant="standard"
                            defaultValue={product["price"]}
                            type="number"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                              Currency
                            </InputLabel>
                            <NativeSelect
                              defaultValue={Object.keys(currencies)[Object.keys(currencies).findIndex((currency) => currency === "INR")]}
                              inputProps={{ name: "currency", id: "uncontrolled-native" }}
                            >
                              {Object.keys(currencies).map((currency) => (
                                <option key={"Dashboard_NewProduct_currency_" + currency} value={currency}>
                                  {currencies[currency]}
                                </option>
                              ))}
                            </NativeSelect>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField required name="deal" label="Deal" fullWidth variant="standard" defaultValue={product["deal"]} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormGroup>
                            <FormControlLabel
                              control={<Switch sx={{ m: 1 }} defaultChecked={product["availability"] === "true"} name="availability" />}
                              label={"Availability"}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                      <Stack spacing={2} direction="row" justifyContent={"space-between"} sx={{ display: "flex", mt: 2 }}>
                        <LoadingButton loading={isLoading} type="submit" variant="contained" startIcon={<SyncAlt />}>
                          Upload
                        </LoadingButton>
                      </Stack>
                    </form>
                  </Grid>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
          <Typography component="p" variant="h4" align="center" color="error">
            Profile Incomplete!
          </Typography>
          <Typography component="p" variant="body1" align="center" color="text.secondary">
            Update your profile with all the necessary details to become a vendor!
          </Typography>
          <Button onClick={() => navigate(VENDOR_PROFILE_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
            Update Profile
          </Button>
        </Stack>
      )}
      <Footer />
    </Box>
  );
};

export default NewProducts;
