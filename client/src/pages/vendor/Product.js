import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
// contexts
import AppContext from "../../contexts/AppContext";
import VendorContext from "../../contexts/VendorContext";
// components
import Loader from "../../components/Loader";
// constants
import { categories, currencies } from "../../constants/data";
import { UPLOAD_URL } from "../../constants/urls";
import { PRODUCT_EDIT_PRODUCT_ENDPOINT, PRODUCT_REMOVE_PRODUCTS_ENDPOINT, FILE_NEW_FILES_ENDPOINT } from "../../constants/endpoints";
// mui
import {
  Stack,
  Grid,
  Autocomplete,
  Fab,
  Box,
  Collapse,
  TableCell,
  TableRow,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close, SyncAlt, Add, CheckCircle, Cancel } from "@mui/icons-material";

const Product = ({ index, product, setProducts }) => {
  const [open, setOpen] = useState(false);
  const { mode } = useContext(AppContext);
  const { user } = useContext(VendorContext);
  const [isAvailable, setIsAvailable] = useState(product["availability"] === "true");
  const [isLoading, setIsLoading] = useState(false);
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const filesRef = useRef(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {},
      formData = new FormData(form),
      now = Date.now();
    formData.forEach((value, key) => (data[key] = value));
    data["availability"] = isAvailable.toString();
    const updatedFiles = newFiles.map(
      (file, index) =>
        new File([file], user.role + "." + user.email + "." + now + "." + index + "." + file.name.split(".").at(-1), { type: file.type })
    );
    data["files"] = [...oldFiles, ...updatedFiles.map((file) => file.name)];
    data["deletedFiles"] = product.files.filter((file) => !data["files"].includes(file));
    try {
      setIsLoading(true);
      axios
        .patch(PRODUCT_EDIT_PRODUCT_ENDPOINT, { _id: product._id, updates: data })
        .then((res) => {
          setOldFiles(data.files);
          setProducts((products) => {
            const prdcts = [...products];
            const idx = prdcts.findIndex((prdct) => prdct._id === product._id);
            if (idx !== -1) prdcts[idx] = { ...prdcts[idx], ...data };
            return prdcts;
          });
          if (updatedFiles.length) {
            try {
              const filesData = new FormData();
              updatedFiles.forEach((updatedFile) => filesData.append("files", updatedFile));
              axios.post(FILE_NEW_FILES_ENDPOINT, filesData).then((res) => {
                alert(data.title + " uploaded successfully!");
                setNewFiles([]);
                setOpen(false);
                setIsLoading(false);
              });
            } catch (err) {
              setOpen(false);
              setIsLoading(false);
            }
          } else {
            alert(data.title + " updated successfully!");
            setOpen(false);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setOpen(false);
          setIsLoading(false);
        });
    } catch (err) {
      setOpen(false);
      setIsLoading(false);
    }
  };

  const handleRemove = (productId) => {
    try {
      setIsLoading(true);
      axios
        .delete(PRODUCT_REMOVE_PRODUCTS_ENDPOINT, { data: { _id: productId } })
        .then((res) => {
          setProducts((products) => products.filter((product) => product._id !== productId));
          alert(product.title + " has been REMOVED!");
          window.scrollTo(0, 0);
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

  useEffect(() => {
    if (product?.files?.length) setOldFiles(product.files);
  }, [product]);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length) setNewFiles((files) => [...files, ...newFiles]);
  };

  const handleOldFilesDelete = (file) => {
    setOldFiles((files) => files.filter((f) => f !== file));
  };

  const handleNewFilesDelete = (file) => {
    setNewFiles((files) => files.filter((f) => f !== file));
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <TableRow
        onClick={() => setOpen((open) => !open)}
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer", "&::hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      >
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell>{product.title}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell align="center">{product.price}</TableCell>
        <TableCell align="center">{product.currency}</TableCell>
        <TableCell align="center">{product.availability === "true" ? <CheckCircle color="success" /> : <Cancel color="error" />}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Stack direction="row">
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
                  <Carousel showStatus={false} showThumbs={false} stopOnHover={false}>
                    {oldFiles.map((file) => (
                      <div key={file} style={{ position: "relative" }}>
                        <Fab
                          onClick={() => handleOldFilesDelete(file)}
                          sx={{ position: "absolute", top: 8, right: 8 }}
                          size="small"
                          color="error"
                        >
                          <Close fontSize="medium" />
                        </Fab>
                        <img style={{ width: "100%", objectFit: "cover" }} src={UPLOAD_URL + file} alt="" loading="lazy" />
                      </div>
                    ))}
                    {newFiles.map((file) => (
                      <div key={URL.createObjectURL(file)} style={{ position: "relative" }}>
                        <Fab
                          onClick={() => handleNewFilesDelete(file)}
                          sx={{ position: "absolute", top: 8, right: 8 }}
                          size="small"
                          color="error"
                        >
                          <Close fontSize="medium" />
                        </Fab>
                        <img style={{ width: "100%", objectFit: "cover" }} src={URL.createObjectURL(file)} alt="" loading="lazy" />
                      </div>
                    ))}
                  </Carousel>
                </Stack>
                <Stack flex={2} p={2} style={{ width: "100%", overflowX: "hidden", overflowY: "auto" }}>
                  <Grid item xs={12} mb={{ xs: 5, md: 0 }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      Edit Product
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
                        {oldFiles.map((file) => (
                          <div key={file} style={{ position: "relative" }}>
                            <Fab
                              onClick={() => handleOldFilesDelete(file)}
                              sx={{ position: "absolute", top: 8, right: 8 }}
                              size="small"
                              color="error"
                            >
                              <Close fontSize="medium" />
                            </Fab>
                            <img style={{ width: "100%" }} src={UPLOAD_URL + file} alt="" loading="lazy" />
                          </div>
                        ))}
                      </Carousel>
                    </Stack>
                    <form onSubmit={handleUpdate}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField required name="title" label="Title" fullWidth variant="standard" defaultValue={product["title"]} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            fullWidth
                            required
                            disablePortal
                            options={categories.map((category) => ({ label: category }))}
                            defaultValue={product["category"]}
                            renderInput={(params) => <TextField {...params} name="category" variant="standard" label="Category" />}
                          />
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
                          <Autocomplete
                            fullWidth
                            required
                            disablePortal
                            options={Object.keys(currencies).map((key) => ({ label: key + " - " + currencies[key] }))}
                            defaultValue={product["currency"]}
                            renderInput={(params) => <TextField {...params} name="currency" variant="standard" label="Currency" />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField required name="deal" label="Deal" fullWidth variant="standard" defaultValue={product["deal"]} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormGroup>
                            <FormControlLabel
                              control={<Switch sx={{ m: 1 }} checked={isAvailable} name="availability" />}
                              onChange={(e, val) => setIsAvailable(val)}
                              label="Availability"
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                      <Stack spacing={2} direction="row" justifyContent={"space-between"} sx={{ display: "flex", mt: 2 }}>
                        <LoadingButton loading={isLoading} type="submit" variant="contained" startIcon={<SyncAlt />}>
                          Update
                        </LoadingButton>
                        <LoadingButton
                          loading={isLoading}
                          onClick={() =>
                            window.confirm("Are your sure you wish to REMOVE " + product.title + "?") ? handleRemove(product._id) : null
                          }
                          variant="contained"
                          color="error"
                          startIcon={<Close />}
                        >
                          Remove
                        </LoadingButton>
                      </Stack>
                    </form>
                  </Grid>
                </Stack>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Product;
