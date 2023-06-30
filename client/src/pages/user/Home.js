import React, { useState, useEffect, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// constants
import { COMPANY } from "../../constants/variables";
import { UPLOAD_URL } from "../../constants/urls";
import { categories } from "../../constants/data";
import { PRODUCTS_GET_FEATURED_PRODUCTS_ENDPOINT } from "../../constants/endpoints";
import { SEARCH_ROUTE } from "../../constants/routes";
// contexts
import UserContext from "../../contexts/UserContext";
// mui
import { Typography, Stack, Avatar, Box, Button, ButtonGroup, Link } from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// components
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";
// utils
import { truncateStr } from "../../utils";
import axios from "axios";
// vars
const MAX_PRODUCT_CARD_WIDTH = 500;

const Home = () => {
  const navigate = useNavigate();
  const { setProduct } = useContext(UserContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(Math.ceil(window.innerWidth / MAX_PRODUCT_CARD_WIDTH));

  useEffect(() => {
    const updateCount = () => setCount(Math.ceil(window.innerWidth / MAX_PRODUCT_CARD_WIDTH));
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(PRODUCTS_GET_FEATURED_PRODUCTS_ENDPOINT, { params: { limit: 10 } })
      .then((res) => {
        setFeaturedProducts(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      {isLoading ? <Loader /> : null}
      {Object.keys(featuredProducts).filter((key) => featuredProducts[key].length).length ? (
        <React.Fragment>
          <Carousel
            sx={{ width: "100%", height: "50vh", overflow: "hidden", userSelect: "none" }}
            stopOnHover={false}
            showArrows={false}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            autoFocus
            autoPlay
            infiniteLoop
          >
            {featuredProducts[Object.keys(featuredProducts).filter((key) => featuredProducts[key].length)[0]].map((product) => (
              <Box
                key={product._id}
                onClick={() => setProduct(product)}
                sx={{ width: "100%", height: "50vh", overflow: "hidden", cursor: "pointer" }}
              >
                <img
                  style={{ width: "100%", height: "100vh", objectFit: "cover", filter: "brightness(0.75)" }}
                  src={
                    product.files.length ? (product.files[0].startsWith("https://") ? product.files[0] : UPLOAD_URL + product.files[0]) : ""
                  }
                  alt={product.title}
                  loading="lazy"
                />
                <Stack p={2} sx={{ position: "fixed", bottom: "0", width: "100%", userSelect: "text" }}>
                  <Stack onClick={() => {}} direction="row" alignItems="center" sx={{ cursor: "pointer" }}>
                    <Avatar
                      sx={{ width: 50, height: 50, m: 1, ml: 0 }}
                      src={UPLOAD_URL + product.ownerProfilePic || product.ownerName}
                      alt={product.ownerName}
                      loading="lazy"
                    />
                    <Stack>
                      <Typography variant="h5" align="left" color="white">
                        {product.title}
                      </Typography>
                      <Typography variant="body1" align="left" color="white" gutterBottom>
                        {product.ownerName}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="warning.light" align="left" sx={{ fontWeight: "700" }} gutterBottom>
                    {product.category}
                  </Typography>
                  <Typography variant="body2" align="left" color="white" sx={{ pb: 2, maxWidth: "600px" }}>
                    {truncateStr(product.desc, 250)}
                  </Typography>
                  <Stack alignItems="center" direction="row" spacing={2} sx={{ flex: 1 }}>
                    <Typography align="left" variant="h5" color="white">
                      {product.price} {product.currency}
                      <Typography sx={{ fontSize: "12px", fontWeight: "bold", ml: 1 }} variant="span" color="error.light">
                        {product.deal}
                      </Typography>
                    </Typography>
                    <Button sx={{ px: 5 }} variant="contained" startIcon={<PointOfSaleIcon />}>
                      Place Order
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Carousel>
          {categories.length ? (
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <Stack direction="row" spacing={2}>
                <ButtonGroup disableElevation variant="contained" sx={{ flexWrap: "wrap" }}>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => {
                        navigate(SEARCH_ROUTE + "/" + category.title);
                        setProduct(null);
                      }}
                      sx={{ whiteSpace: "nowrap", borderRadius: 0 }}
                    >
                      {category.title}
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>
            </Stack>
          ) : null}
          {Object.keys(featuredProducts).filter((key) => featuredProducts[key].length).length ? (
            <Stack spacing={2} p={2}>
              {Object.keys(featuredProducts)
                .filter((key) => featuredProducts[key].length)
                .map((key) => (
                  <Stack key={key} spacing={2}>
                    <Typography variant="h6" align="left" color="primary">
                      {key}
                    </Typography>
                    {/* <Link onClick={() => {}} sx={{ cursor: "pointer", mt: "0 !important" }}>
                      View All
                    </Link> */}
                    <Carousel
                      showStatus={false}
                      showIndicators={false}
                      stopOnHover={false}
                      showThumbs={false}
                      autoFocus
                      autoPlay
                      infiniteLoop
                    >
                      {featuredProducts[key]
                        .filter((item, index) => index % 3 === 0)
                        .map((product, index) => (
                          <Stack key={product._id} justifyContent="center" direction="row" p={2} mx={3} spacing={2}>
                            {featuredProducts[key].slice(index * count, index * count + count).map((product, index) => (
                              <ProductCard
                                key={product._id}
                                sx={{ width: "100%", maxWidth: window.innerWidth / count }}
                                product={product}
                              />
                            ))}
                          </Stack>
                        ))}
                    </Carousel>
                  </Stack>
                ))}
            </Stack>
          ) : null}
        </React.Fragment>
      ) : (
        <Stack py={16} spacing={2} alignItems="center" justifyContent="center">
          <Typography color="text.secondary" component="p" variant="h4" align="center">
            No Products Yet!
          </Typography>
          <Typography color="text.secondary" component="p" variant="body1" align="center">
            There haven't been added any products yet. Try again after sometime!
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default Home;
