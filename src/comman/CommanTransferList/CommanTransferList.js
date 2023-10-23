/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

const not = (a, b) => a.filter((value) => b.indexOf(value) === -1);

const intersection = (a, b) => a.filter((value) => b.indexOf(value) !== -1);

const TransferList = ({ items, onTransfer }) => {
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(items.left);
    const [right, setRight] = useState(items.right);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight([...right, ...left]);
        onTransfer([...right, ...left], "right");
        console.log([...right, ...left], "right");
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight([...right, ...leftChecked]);
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        onTransfer(leftChecked, "right");
    };

    const handleCheckedLeft = () => {
        setLeft([...left, ...rightChecked]);
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        onTransfer(rightChecked, "left");
    };

    const handleAllLeft = () => {
        setLeft([...left, ...right]);
        console.log([...left, ...right], "left");
        onTransfer([...left, ...right], "left");

        setRight([]);
    };

    const customList = (items) => (
        <Paper sx={{ width: '100%', height: 180, overflow: "auto" }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    color="success"
                                    inputProps={{
                                        "aria-labelledby": labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <div>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="contained"
                            color="success"
                            size="medium"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            color="success"
                            size="medium"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            {">"}

                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            color="success"
                            size="medium"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            {"<"}
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="contained"
                            color="success"
                            size="medium"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
        </div>
    );
};

export default TransferList;
