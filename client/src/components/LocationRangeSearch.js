import React, { useContext } from "react";
// mui
import { Stack, Typography, Slider, Button } from "@mui/material";
// contexts
import HomeContext from "../contexts/UserContext";
// data
const locationMarks = [{ value: 0, label: "0" }, { value: 1000, label: "1 KM" }, { value: 5000, label: "5 KM" }, { value: 10000, label: "10 KM" }];

const LocationRangeSearch = () => {
    const { locationRange, setLocationRange, handleLocationRange } = useContext(HomeContext);
    return (
        <Stack justifyContent="center" sx={{ minHeight: "100vh" }} alignItems={"center"} spacing={4}>
            <Typography variant="h4" align="center" px={2} color="error">No results in the range!</Typography>
            <Typography variant="h5" align="center" px={2} color="text.light">Update the search range to grab the best deals nearby!</Typography>
            <Slider
                value={locationRange}
                onChange={e => setLocationRange([e.target.value[0], e.target.value[1]])}
                valueLabelDisplay="auto"
                marks={locationMarks}
                step={10}
                valueLabelFormat={val => `${(val / 1000).toFixed(1)} KM`}
                sx={{ width: "calc(100% - 64px)", maxWidth: 500, mx: "32px" }}
                max={10000}
            />
            <Button variant="contained" onClick={() => handleLocationRange()}>Change</Button>
        </Stack>);
};

export default LocationRangeSearch;