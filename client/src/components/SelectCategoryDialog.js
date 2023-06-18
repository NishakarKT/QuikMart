import React from "react";
import Draggable from "react-draggable";
// mui
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, Paper, Grid } from "@mui/material";
import { categories } from "../constants/data";
// constants
import { COMPANY } from "../constants/variables";

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

const CategoryDialog = ({ categoryOpen, setCategoryOpen, category, setCategory }) => {

    const handleCategory = categ => {
        setCategory(categ);
        const currData = JSON.parse(localStorage.getItem(COMPANY));
        localStorage.setItem(COMPANY, JSON.stringify({ ...currData, category: categ }));
        setCategoryOpen(false);
    }

    return (
        <Dialog
            open={categoryOpen}
            onClose={() => setCategoryOpen(false)}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Choose your market!
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select a market you wish to explore for best deals!
                </DialogContentText>
            </DialogContent>
            <Grid container spacing={2} p={2}>
                {categories.map(categ =>
                    <Grid key={categ.title} item xs={12} sm={6}>
                        <Button fullWidth variant={categ.title === category ? "contained" : "outlined"} onClick={() => handleCategory(categ.title)}>{categ.title}</Button>
                    </Grid>)}
            </Grid>
        </Dialog>
    );
};

export default CategoryDialog;