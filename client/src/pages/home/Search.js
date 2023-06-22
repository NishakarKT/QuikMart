import React, { Fragment, useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
// contexts
import HomeContext from "../../contexts/HomeContext";
// components
import ProductCard from "../../components/ProductCard";
// constants
import { COMPANY } from "../../constants/variables";
// mui
import { Grid, Stack, Pagination, Typography } from "@mui/material";
//  variables
const ITEMS_PER_PAGE = 8;

const Search = () => {
    const { query } = useParams();
    const { products } = useContext(HomeContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setFilteredProducts(products.filter(product => product.title.toLowerCase().includes(query.toLowerCase())));
    },[query, products]);

    const handlePage = page => {
        setPage(page);
        setTimeout(() => window.scrollTo(0, 0), 0);
    };

    return (
        <Fragment>
            <Helmet><title>"{query}" | {COMPANY}</title></Helmet>
            <Stack pt={9}>
                <Typography px={2} py={1} variant="h5" color="text.secondary"><Typography color="primary.main" variant="span">{filteredProducts.length}</Typography> result{filteredProducts.length !== 1 ? "s" : ""} for <Typography color="primary.main" variant="span">"{query}"</Typography></Typography>
                <Grid container>
                    {filteredProducts.slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page).map(product => <Grid item xs={12} sm={6} lg={3} p={1} key={product.img}><ProductCard product={product} /></Grid>)}
                </Grid>
                <Pagination onChange={(e, page) => handlePage(page)} sx={{ alignSelf: "center", m: 4 }} count={Math.ceil(products.length / ITEMS_PER_PAGE)} color="primary" />
            </Stack>
        </Fragment>
    );
};

export default Search;