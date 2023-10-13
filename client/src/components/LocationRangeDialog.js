import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
// constants
import { COMPANY } from "../constants/variables";
// mui
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slider, Paper } from "@mui/material";
// vars
const locationMarks = [{ value: 0, label: "0" }, { value: 1000, label: "1 KM" }, { value: 5000, label: "5 KM" }, { value: 10000, label: "10 KM" }]

const PaperComponent = props => {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
};

const LocationRangeDialog = ({ locationRangeOpen, setLocationRangeOpen, locationRange, setLocationRange }) => {
    const [range, setRange] = useState(locationRange);

    useEffect(() => {
        setRange(locationRange);
    }, [locationRange]);

    const handleRange = () => {
        setLocationRange(range);
        const currData = JSON.parse(localStorage.getItem(COMPANY));
        localStorage.setItem(COMPANY, JSON.stringify({ ...currData, range }));
        setLocationRangeOpen(false);
    };

    return (
        <Dialog
            open={locationRangeOpen}
            onClose={() => setLocationRangeOpen(false)}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Location Range
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Update the search range to grab the best deals nearby!
                </DialogContentText>
            </DialogContent>
            <Slider
                value={range}
                onChange={(e, newRange) => setRange(newRange)}
                valueLabelDisplay="auto"
                step={10}
                valueLabelFormat={val => `${(val / 1000).toFixed(1)} KM`}
                marks={locationMarks}
                sx={{ mx: "32px", mt: 2, mb: 4, width: "calc(100% - 64px)", boxSizing: "border-box" }}
                max={10000}
            />
            <DialogActions>
                <Button variant="outlined" onClick={() => setLocationRangeOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => handleRange()}>Change</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationRangeDialog;