import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Carousel } from "react-responsive-carousel";
// constants
import { COMPANY } from "../../constants/variables";
import { UPLOAD_URL } from "../../constants/urls";
// contexts
import UserContext from "../../contexts/UserContext";
// mui
import { Container, Typography, Stack, Avatar, Box, Button } from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// components
import ProductCard from "../../components/ProductCard";
// utils
import { truncateStr } from "../../utils";
// vars
const MAX_PRODUCT_CARD_WIDTH = 500;

const Home = () => {
  const { products, setProduct } = useContext(UserContext);
  const [count, setCount] = useState(Math.ceil(window.innerWidth / MAX_PRODUCT_CARD_WIDTH));

  useEffect(() => {
    const updateCount = () => setCount(Math.ceil(window.innerWidth / MAX_PRODUCT_CARD_WIDTH));
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      {products.length ? (
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
            {products.slice(0, 5).map((product) => (
              <Box
                key={product._id}
                onClick={() => setProduct(product)}
                sx={{ width: "100%", height: "50vh", overflow: "hidden", cursor: "pointer" }}
              >
                <img
                  style={{ width: "100%", height: "100vh", objectFit: "cover", filter: "brightness(0.25)" }}
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
                  <Typography align="left" variant="h5" color="white" sx={{ py: 2 }}>
                    {product.price}
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold", ml: 1 }} variant="span" color="error.main">
                      {product.deal}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" align="left" color="white" sx={{ pb: 2 }}>
                    {truncateStr(product.desc, 100)}
                  </Typography>
                  <Stack alignItems="flex-end" direction="row" spacing={1} sx={{ flex: 1 }}>
                    <Button sx={{ px: 5 }} variant="contained" startIcon={<PointOfSaleIcon />}>
                      Place Order
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Carousel>
          <Carousel showStatus={false} showIndicators={false} stopOnHover={false} showThumbs={false} autoFocus autoPlay infiniteLoop>
            {products
              .slice(0, 10)
              .map((product, index) => (
                <Stack key={product._id} justifyContent="center" direction="row" p={2} mx={3} spacing={2}>
                  {products.slice(index, index + count).map((product, index) => (
                    <ProductCard key={product._id} sx={{ width: "100%", maxWidth: window.innerWidth / count }} product={product} />
                  ))}
                </Stack>
              ))}
          </Carousel>
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
