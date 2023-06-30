import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
// constants
import { COMPANY } from "../../constants/variables";
import { PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT, PRODUCT_GET_PRODUCTS_COUNT_BY_QUERY_ENDPOINT } from "../../constants/endpoints";
// components
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";
// mui
import { Stack, Grid, Pagination, Typography } from "@mui/material";

const Search = () => {
  const { search } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [ttl, setTtl] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT, { params: { search, limit, page } })
      .then((res) => {
        setProducts(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    axios
      .get(PRODUCT_GET_PRODUCTS_COUNT_BY_QUERY_ENDPOINT, { params: { search, limit, page } })
      .then((res) => setTtl(res.data.data))
      .catch((err) => console.log(err));
    window.scrollTo(0, 0);
  }, [search, page, limit]);

  return (
    <>
      <Helmet>
        <title>Wishlist | {COMPANY}</title>
      </Helmet>
      {isLoading ? <Loader /> : null}
      <Stack p={2} pb={0} alignItems="center">
        <Typography variant="h5" align="left" color="text.secondary" sx={{ width: "100%" }} gutterBottom>
          Search Results for{" "}
          <Typography component="span" variant="h5" color="primary">
            {search}
          </Typography>
        </Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        <Pagination count={ttl} page={page} onChange={(e, page) => setPage(page)} sx={{ py: 4 }} />
      </Stack>
    </>
  );
};

export default Search;
