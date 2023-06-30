import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// contexts
import VendorContext from "../../contexts/VendorContext";
// components
import Loader from "../../components/Loader";
// constants
import { PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT } from "../../constants/endpoints";
import { VENDOR_NEW_PRODUCTS_ROUTE, AUTH_VENDOR_ROUTE, VENDOR_PROFILE_ROUTE } from "../../constants/routes";
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
} from "@mui/material";
// components
import Footer from "../../components/Footer";
import Product from "./Product";
// vars
const ITEMS_PER_PAGE = 5;

const Products = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { user, isProfileComplete, products, setProducts } = useContext(VendorContext);
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate(AUTH_VENDOR_ROUTE);
    else if (user._id) {
      setIsLoading(true);
      axios
        .get(PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT, { params: { owner: user._id } })
        .then((res) => {
          const products = res.data.data;
          if (products.length) {
            setProducts(products);
            setPage(1);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [user, setProducts, navigate]);

  const handlePage = (page) => {
    setPage(page);
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
  };

  const handleSearch = (productId) => setProduct(products.find((product) => product._id === productId));

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
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Your Products
              </Typography>
              {products.length ? (
                <>
                  <TableContainer>
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
                </>
              ) : (
                <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
                  <Typography component="p" variant="h6" align="center" color="error">
                    No Products!
                  </Typography>
                  <Typography component="p" variant="body1" align="center" color="text.secondary">
                    You haven't added any products/services. Add one to attract customers!
                  </Typography>
                  <Button onClick={() => navigate(VENDOR_NEW_PRODUCTS_ROUTE)} sx={{ width: "fit-content" }} variant="contained">
                    Create a Product
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
          {product ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography p={2} pt={0} component="h2" variant="h5">
                  Search Results
                </Typography>
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
              </Paper>
            </Grid>
          ) : null}
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

export default Products;
