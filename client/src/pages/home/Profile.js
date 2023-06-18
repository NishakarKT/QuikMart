import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
// contexts
import AppContext from "../../contexts/AppContext";
// constants
import { products } from "../../constants/data";
import { UPLOAD_URL } from "../../constants/urls";
import { COMPANY } from "../../constants/variables";
import { HISTORY_ROUTE } from "../../constants/routes";
import { USER_ENDPOINT, FILE_NEW_FILE_ENDPOINT } from "../../constants/endpoints";
// mui
import { Stack, Box, Grid, Container, Button, TextField, Typography, List, ListItem, ListItemText, Link, CardMedia } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { SyncAlt, Edit, AddLocation } from "@mui/icons-material";
// utils
import { getLocation } from "../../utils";

const Profile = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const profilePicRef = useRef(null);
  const coverPicRef = useRef(null);
  const { user, setUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [location, setLocation] = useState([]);
  const [locationErr, setLocationErr] = useState(false);

  useEffect(() => {
    setLocation(user.location.coordinates || []);
  }, [user, setLocation]);

  const handleEdit = () => {
    setIsEditable(true);
    window.scrollTo(0, 0);
  }

  const handleUpdate = e => {
    e.preventDefault();
    if (!(location[0] && location[1]))
      setLocationErr(true);
    else if (formRef.current) {
      setLocationErr(false);
      const edits = {}, formData = new FormData(formRef.current);
      if (profilePic) {
        const picData = new FormData();
        const fileName = user.email + ".profile." + profilePic.name.split('.').at(-1);
        edits["profilePic"] = fileName;
        picData.append("file", profilePic, fileName);
        try {
          setIsLoading(true);
          axios.post(FILE_NEW_FILE_ENDPOINT, picData)
            .then(res => {
              setIsLoading(false);
            })
            .catch(err => {
              alert("Something went wrong! Profile Picture couldn't be uploaded.");
              setIsLoading(false);
            })
        } catch (err) {
          alert("Something went wrong! Profile Picture couldn't be uploaded.");
          setIsLoading(false);
        };
      }
      if (coverPic) {
        const picData = new FormData();
        const fileName = user.email + ".cover." + coverPic.name.split('.').at(-1);
        edits["coverPic"] = fileName;
        picData.append("file", coverPic, fileName);
        try {
          setIsLoading(true);
          axios.post(FILE_NEW_FILE_ENDPOINT, picData)
            .then(res => {
              setIsLoading(false);
            })
            .catch(err => {
              alert("Something went wrong! Cover Picture couldn't be uploaded.");
              setIsLoading(false);
            })
        } catch (err) {
          alert("Something went wrong! Cover Picture couldn't be uploaded.");
          setIsLoading(false);
        };
      }
      formData.forEach((value, key) => (edits[key] = value)); // FormData to JS object
      if (location)
        edits["location"] = { type: "Point", coordinates: location };
      try {
        setIsLoading(true);
        axios.patch(USER_ENDPOINT, { _id: user._id, edits })
          .then(res => {
            alert("Your profile has been updated!");
            setUser(user => ({ ...user, ...res.data }));
            setIsEditable(false);
            setIsLoading(false);
          })
          .catch(err => {
            setIsLoading(false);
          })
      } catch (err) {
        setIsLoading(false);
      };
    }
  };

  const handleCoverPic = e => {
    const image = e.target.files[0];
    if (image.type.startsWith("image/")) {
      setCoverPic(image);
      setIsEditable(true);
    }
    else {
      alert("Invalid file type! Upload an 'image' file as your cover picture.");
      setCoverPic(null);
    }
  };

  const handleProfilePic = e => {
    const image = e.target.files[0];
    if (image.type.startsWith("image/")) {
      setProfilePic(image);
      setIsEditable(true);
    } else {
      setProfilePic(null);
      alert("Invalid file type! Upload an 'image' file as your profile picture.");
    }
  };

  const handleLocation = async () => {
    setIsEditable(true);
    const location = await getLocation();
    setLocation(location);
  };

  return (
    <Container component="main" sx={{ my: 10 }}>
      <Helmet><title>Profile | {COMPANY}</title></Helmet>
      <Grid container>
        <Grid item xs={12} md={8} mb={{ xs: 5, md: 0 }}>
          <Typography component="h1" variant="h4">Profile</Typography>
          <form onSubmit={handleUpdate} ref={formRef}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.name} name="name" label="Name" fullWidth variant="standard" /></Grid>
              <Grid item xs={12} sm={6}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.contact} name="contact" label="Contact" fullWidth variant="standard" /></Grid>
              <Grid item xs={12}><TextField required inputProps={{ disabled: true }} defaultValue={user.email} name="email" label="Email Address" fullWidth variant="standard" /></Grid>
              <Grid item xs={12}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.address1} name="address1" label="Address line 1" fullWidth variant="standard" /></Grid>
              <Grid item xs={12}><TextField inputProps={{ disabled: !isEditable }} defaultValue={user.address2} name="address2" label="Address line 2" fullWidth variant="standard" /></Grid>
              <Grid item xs={12} sm={6}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.city} name="city" label="City" fullWidth variant="standard" /></Grid>
              <Grid item xs={12} sm={6}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.state} name="state" label="State/Province/Region" fullWidth variant="standard" /></Grid>
              <Grid item xs={12} sm={6}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.zip} name="zip" label="Zip / Postal code" fullWidth variant="standard" /></Grid>
              <Grid item xs={12} sm={6}><TextField required inputProps={{ disabled: !isEditable }} defaultValue={user.country} name="country" label="Country" fullWidth variant="standard" /></Grid>
              <Grid item xs={12}>
                <Stack spacing={2} direction="row" alignItems="flex-end">
                  <TextField flex={1} readOnly label="Location" error={locationErr} helperText={locationErr ? "Please, update your location!" : ""} value={"LNG: " + (location[0]?.toFixed(2) || "____") + " LAT: " + (location[1]?.toFixed(2) || "____")} fullWidth variant="standard" />
                  <Button variant="outlined" sx={{ width: "fit-content", whiteSpace: "nowrap", mt: 3, px: 6 }} startIcon={<AddLocation />} onClick={() => handleLocation()}>Update Location</Button>
                </Stack>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {isEditable ? <LoadingButton loading={isLoading} type="submit" variant="contained" startIcon={<SyncAlt />} sx={{ mt: 3 }}>Update Profile</LoadingButton> : null}
              {!isEditable ? <Button variant="contained" startIcon={<Edit />} sx={{ mt: 3 }} onClick={() => handleEdit()}>Edit Profile</Button> : null}
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} md={4} pl={{ xs: 0, md: 5 }}>
          <Typography variant="h6" gutterBottom>Media</Typography>
          <input onChange={handleCoverPic} accept="image/*" ref={coverPicRef} type="file" hidden />
          <CardMedia onClick={() => coverPicRef?.current?.click()} component="img" sx={{ height: "150px", backgroundColor: "lightgray", cursor: "pointer", transition: "all 0.5s", "&:hover": { filter: "brightness(0.75)" } }} loading="lazy" src={coverPic ? URL.createObjectURL(coverPic) : UPLOAD_URL + user.coverPic} alt="" />
          <input onChange={handleProfilePic} accept="image/*" ref={profilePicRef} type="file" hidden />
          <CardMedia onClick={() => profilePicRef?.current?.click()} component="img" sx={{ position: "relative", borderRadius: "50%", backgroundColor: "lightgray", width: "150px", height: "150px", outline: "2px solid white", margin: "auto", marginTop: "-75px", zIndex: "1", cursor: "pointer", transition: "all 0.5s", "&:hover": { filter: "brightness(0.75)" } }} loading="lazy" src={profilePic ? URL.createObjectURL(profilePic) : UPLOAD_URL + user.profilePic} alt="" />
          <Typography variant="h6" gutterBottom>Past Orders</Typography>
          <List disablePadding>
            {products.slice(0, 5).map((product, index) => (
              <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
                <ListItemText primary={(index + 1) + ". " + product.title} secondary={product.subtitle} />
                <Typography variant="body2">{product.price}</Typography>
              </ListItem>
            ))}
            <ListItem sx={{ py: 1, px: 0 }}>
              <Link onClick={() => navigate(HISTORY_ROUTE)} underline="hover" sx={{ cursor: "pointer", marginLeft: "auto" }}>View More</Link>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;