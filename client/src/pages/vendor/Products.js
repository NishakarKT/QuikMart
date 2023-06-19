import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// contexts
import AppContext from "../../contexts/AppContext";
import VendorContext from "../../contexts/VendorContext";
// constants
import { PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT } from "../../constants/endpoints";
import { VENDOR_NEW_PRODUCTS_ROUTE, PROFILE_ROUTE } from "../../constants/routes";
// mui
import {
  Stack,
  Autocomplete,
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
  Container,
  TextField,
} from "@mui/material";
// components
import Footer from "../../components/Footer";
import Product from "./Product";
// vars
const ITEMS_PER_PAGE = 5;

const Products = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { mode } = useContext(AppContext);
  const { user, isProfileComplete, products, setProducts } = useContext(VendorContext);
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    try {
      axios
        .get(PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT, { params: { owner: user._id } })
        .then((res) => {
          const products = res.data.data;
          if (products.length) {
            setProducts(products);
            setPage(1);
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }, [user, setProducts]);

  const handlePage = (page) => {
    setPage(page);
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
  };

  const handleSearch = (productId) => setProduct(products.find((product) => product._id === productId));

  return (
    <Box
      ref={containerRef}
      component="main"
      sx={{
        backgroundColor: (theme) => (mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100]),
        flexGrow: 1,
        height: "100vh",
        scrollBehavior: "smooth",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Paper
        sx={{
          p: 2,
          m: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isProfileComplete(user) ? (
          <>
            <Stack direction={"row"} alignItems="center">
              <Typography component="h1" variant="h4" sx={{ mr: 2 }}>
                Products
              </Typography>
              <Autocomplete
                autoHighlight
                fullWidth
                disablePortal
                onChange={(e, value) => handleSearch(value._id)}
                flex={1}
                options={products.map((product) => ({ label: product.title, _id: product._id }))}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Type to search among your products" variant="standard" label="Search Product" />
                )}
              />
            </Stack>
            {product ? (
              <React.Fragment>
                <Typography p={2} pt={0} component="h2" variant="h5">
                  Search Results
                </Typography>
                <Container sx={{ px: "16px !important" }}>
                  <TableContainer sx={{ mb: 2 }} component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Sl No.</TableCell>
                          <TableCell align="center">Title</TableCell>
                          <TableCell align="center">Category</TableCell>
                          <TableCell align="center">Price</TableCell>
                          <TableCell align="center">Currency</TableCell>
                          <TableCell align="center">Availability</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <Product index={0} product={product} setProducts={setProducts} />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Container>
              </React.Fragment>
            ) : null}
            {products.length ? (
              <React.Fragment>
                <Typography p={2} pt={0} component="h2" variant="h5">
                  Your Products
                </Typography>
                <Container sx={{ px: "16px !important" }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Sl No.</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell align="center">Price</TableCell>
                          <TableCell align="center">Currency</TableCell>
                          <TableCell align="center">Availability</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((product, index) => (
                          <Product key={product._id} index={index} product={product} setProducts={setProducts} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Pagination
                    sx={{ display: "block", width: "fit-content", margin: "24px auto" }}
                    onChange={(e, value) => handlePage(value)}
                    count={Math.ceil((products.length || 1) / ITEMS_PER_PAGE)}
                    color="primary"
                  />
                </Container>
              </React.Fragment>
            ) : (
              <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
                <Typography component="p" variant="h4" align="center" sx={{ color: "grey" }}>
                  No Products/Services
                </Typography>
                <Typography component="p" variant="body1" align="center" sx={{ color: "grey" }}>
                  You haven't added any products/services. Add one to attract customers!
                </Typography>
                <Button onClick={() => navigate(VENDOR_NEW_PRODUCTS_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
                  Create a Product/Service
                </Button>
              </Stack>
            )}
          </>
        ) : (
          <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
            <Typography component="p" variant="h4" align="center" color="error">
              Profile Incomplete!
            </Typography>
            <Typography component="p" variant="body1" align="center" sx={{ color: "grey" }}>
              Update your profile with all the necessary details to become a product/service provider!
            </Typography>
            <Button onClick={() => navigate(PROFILE_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
              Update Profile
            </Button>
          </Stack>
        )}
      </Paper>
      <Footer />
    </Box>
  );
};

export default Products;
