import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
// constants
import { products } from "../../constants/data";
import { COMPANY } from "../../constants/variables";
import { HOME_ROUTE } from "../../constants/routes";
// mui
import { Box, Grid, Container, Button, TextField, Typography, List, ListItem, ListItemText, Link } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const WishList = () => {
  let total = Number(0);
  products.forEach((product) => (total = Number(total) + Number(product.price)));
  const navigate = useNavigate();

  const handleOrder = () => {};

  const clearOrder = () => {};

  return (
    <Container component="main" sx={{ my: 10 }}>
      <Helmet>
        <title>WishList | {COMPANY}</title>
      </Helmet>
      <Grid container>
        <Grid item xs={12} md={4} pr={{ xs: 0, md: 5 }}>
          <Typography variant="h6" gutterBottom>
            Your Order
          </Typography>
          <List disablePadding>
            {products.map((product, index) => (
              <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
                <ListItemText primary={index + 1 + ". " + product.title} secondary={product.subtitle} />
                <Typography variant="body2">{product.price}</Typography>
              </ListItem>
            ))}
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {total}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={8} mb={{ xs: 5, md: 0 }}>
          <Typography component="h1" variant="h4">
            WishList
          </Typography>
          {0 ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your contact details has been sent to concerned service providers. You shall be contacted soon.
                <br />
                Thanks for using{" "}
                <Link onClick={() => navigate(HOME_ROUTE)} sx={{ cursor: "pointer" }} underline="none">
                  {COMPANY}
                </Link>
                .
              </Typography>
              <Box>
                <Button variant="contained" startIcon={<AddShoppingCartIcon />} onClick={() => navigate(HOME_ROUTE)} sx={{ mt: 2 }}>
                  Back to Shopping!
                </Button>
              </Box>
            </React.Fragment>
          ) : (
            <Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField required name="firstName" label="First name" fullWidth autoComplete="given-name" variant="standard" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required name="lastName" label="Last name" fullWidth autoComplete="family-name" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="address1"
                    label="Address line 1"
                    fullWidth
                    autoComplete="shipping address-line1"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField name="address2" label="Address line 2" fullWidth autoComplete="shipping address-line2" variant="standard" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required name="city" label="City" fullWidth autoComplete="shipping address-level2" variant="standard" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="state" label="State/Province/Region" fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="zip"
                    label="Zip / Postal code"
                    fullWidth
                    autoComplete="shipping postal-code"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required name="country" label="Country" fullWidth autoComplete="shipping country" variant="standard" />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearOrder} sx={{ mt: 3 }}>
                  Clear Address
                </Button>
                <Button variant="contained" startIcon={<PointOfSaleIcon />} onClick={handleOrder} sx={{ mt: 3, ml: 1 }}>
                  Place Order
                </Button>
              </Box>
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default WishList;
