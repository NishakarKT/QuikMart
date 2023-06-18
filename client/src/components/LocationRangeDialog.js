import React, { useState } from "react";
import Draggable from "react-draggable";
// mui
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slider, Paper } from "@mui/material";
// vars
const locationMarks = [{ value: 0, label: "0" }, { value: 10000, label: "10 KM" }, { value: 50000, label: "50 KM" }, { value: 100000, label: "100 KM" }]

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

    const handleRange = () => {
        setLocationRange(range);
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
                step={100}
                valueLabelFormat={val => `${(val / 1000).toFixed(1)} KM`}
                marks={locationMarks}
                sx={{ mx: "32px", mt: 2, mb: 4, width: "calc(100% - 64px)", boxSizing: "border-box" }}
                max={100000}
            />
            <DialogActions>
                <Button variant="outlined" onClick={() => setLocationRangeOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => handleRange()}>Change</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationRangeDialog;