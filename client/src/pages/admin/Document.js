import React, { useState, useContext } from "react";
import axios from "axios";
// contexts
import AdminContext from "../../contexts/AdminContext";
// constants
import { ADMIN_EDIT_DOCUMENT_ENDPOINT, ADMIN_REMOVE_DOCUMENTS_ENDPOINT } from "../../constants/endpoints";
// components
import Loader from "../../components/Loader";
// utils
import { truncateStr } from "../../utils";
// mui
import { Box, Stack, Grid, Collapse, TableCell, TableRow, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close, SyncAlt } from "@mui/icons-material";

const Document = ({ document, setDocuments }) => {
  const [open, setOpen] = useState(false);
  const { collection } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => (data[key] = value));
    try {
      setIsLoading(true);
      axios
        .patch(ADMIN_EDIT_DOCUMENT_ENDPOINT, { _id: document._id, name: collection, updates: data })
        .then((res) => {
          setDocuments((documents) => documents.map((doc) => (doc._id === document._id ? { ...doc, ...data } : doc)));
          setOpen(false);
          setIsLoading(false);
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

  const handleRemove = () => {
    console.log(document);
    try {
      axios
        .delete(ADMIN_REMOVE_DOCUMENTS_ENDPOINT, { data: { _id: document._id, name: collection } })
        .then((res) => {
          setDocuments((documents) => documents.filter((doc) => doc._id !== document._id));
          alert("Item has been REMOVED!");
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <TableRow
        onClick={() => setOpen((open) => !open)}
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer", "&::hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      >
        {Object.keys(document)
          .filter((key) => typeof document[key] === "string")
          .map((key) => (
            <TableCell key={key} align="left">
              {truncateStr(document[key], 50)}
            </TableCell>
          ))}
      </TableRow>
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Stack flex={2} style={{ overflowX: "hidden", overflowY: "auto" }}>
                <Grid item xs={12} mb={{ xs: 5, md: 0 }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Edit Document
                  </Typography>
                  <form onSubmit={handleUpdate}>
                    <Grid container spacing={2}>
                      {Object.keys(document)
                        .filter((key) => typeof document[key] === "string")
                        .map((key) => (
                          <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                              multiline
                              maxRows={4}
                              name={key}
                              label={key}
                              fullWidth
                              variant="outlined"
                              defaultValue={document[key]}
                            />
                          </Grid>
                        ))}
                    </Grid>
                    <Stack spacing={2} direction="row" justifyContent={"space-between"} sx={{ display: "flex", mt: 2 }}>
                      <LoadingButton loading={isLoading} type="submit" variant="contained" startIcon={<SyncAlt />}>
                        Update
                      </LoadingButton>
                      <LoadingButton
                        loading={isLoading}
                        onClick={() => (window.confirm("Are your sure you wish to REMOVE this item?") ? handleRemove() : null)}
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Document;
