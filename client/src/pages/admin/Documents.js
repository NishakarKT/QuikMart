import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// contexts
import AdminContext from "../../contexts/AdminContext";
// components
import Loader from "../../components/Loader";
// constants
import { ADMIN_GET_DOCUMENTS_ENDPOINT } from "../../constants/endpoints";
import { ADMIN_NEW_ROUTE, AUTH_ADMIN_ROUTE } from "../../constants/routes";
// mui
import {
  Grid,
  Stack,
  Button,
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Toolbar,
  Autocomplete,
  TextField,
} from "@mui/material";
// components
import Footer from "../../components/Footer";
import Document from "./Document";
// vars
const ITEMS_PER_PAGE = 5;

const Documents = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { user, isProfileComplete, documents, setDocuments, collection, setCollection, collections } = useContext(AdminContext);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_ADMIN_ROUTE);
    else if (user._id) {
      setIsLoading(true);
      axios
        .get(ADMIN_GET_DOCUMENTS_ENDPOINT, { params: { owner: user._id } })
        .then((res) => {
          const documents = res.data.data;
          if (documents.length) {
            setDocuments(documents);
            setPage(1);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [user, setDocuments, navigate]);

  const handlePage = (page) => {
    setPage(page);
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
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
            <Paper sx={{ p: 2, pb: 0, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Documents
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
              {documents.length ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {Object.keys(documents[0]).map((key) => (
                            <TableCell key={key} align="left">
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((document, index) => (
                          <Document key={document._id} document={document} setDocuments={setDocuments} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    sx={{ display: "block", width: "fit-content", margin: "24px auto" }}
                    onChange={(e, value) => handlePage(value)}
                    count={Math.ceil((documents.length || 1) / ITEMS_PER_PAGE)}
                    color="primary"
                  />
                </>
              ) : (
                <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
                  <Typography component="p" variant="h6" align="center" color="error">
                    No Documents!
                  </Typography>
                  <Typography component="p" variant="body1" align="center" color="text.secondary">
                    You haven't added any documents/services. Add one to attract customers!
                  </Typography>
                  <Button onClick={() => navigate(ADMIN_NEW_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
                    Create a Document
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : null}
      <Footer />
    </Box>
  );
};

export default Documents;
