import React from "react";
import {
    Paper,
    Button,
    Grid,
    Box,
    Tooltip,
    Typography,
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@material-ui/core";
import { FileCopyOutlined } from "@material-ui/icons";
import AudioPlayer from "material-ui-audio-player";
import theme from "./theme";
import { Link } from 'react-router-dom';

const RegisPlayer = ({
    useStyles = {},
    color = "primary",
    size = "default",
    elevation = 1,
    transcript = "",
    file,
    ...rest
}) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const iconSize = {
        small: 20,
        default: 24,
        large: 36,
        inherit: "inherit"
    }[size];
    const fontSize = {
        small: theme.typography.body2.fontSize,
        default: theme.typography.body1.fontSize,
        large: theme.typography.body1.fontSize
    }[size];
    const spacing = {
        small: { x: 1, y: 0.5, z: 1 },
        default: { x: 1, y: 0.75, z: 1 },
        large: { x: 1.5, y: 1.5, z: 2 }
    }[size];
    const minWidth = {
        small: 220,
        default: 250,
        large: 320
    }[size];

    const useClasses = makeStyles((theme) => ({
        paper: {
            minWidth: minWidth
        },
        root: {
            background: "none",
            "& .MuiGrid-item": {
                display: "flex",
                alignItems: "center"
            },
            "& div[class*='volumeControlContainer']": {
                display: "none"
            },
            "& .MuiSvgIcon-root": {
                fontSize: iconSize
            }
        },
        progressTime: {
            fontSize: fontSize
        },
        ...useStyles
    }));
    const customIcon = makeStyles((theme) => ({
        root: {
            cursor: "pointer",
            "&:hover": {
                color:
                    theme.palette[
                        ["primary", "secondary"].includes(color) ? color : "primary"
                    ].light
            }
        }
    }));

    function copy(text) {
        // Get the text field
        // Copy the text inside the text field
        navigator.clipboard.writeText(text);
        setSuccess("true")
        // Alert the copied text
        alert("Copied the text: " + text);
    }



    const classes = useClasses();
    const customIconClasses = customIcon();
    return (
        <React.Fragment>
            <Paper elevation={elevation} className={classes.paper}>
                <Box px={spacing.x} py={spacing.y}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <AudioPlayer
                                {...rest}
                                variation={color}
                                elevation={0}
                                useStyles={useClasses}
                                spacing={spacing.z}
                            />
                        </Grid>
                        {transcript !== "" && (
                            <Grid item style={{ display: "flex" }}>                                
                                <Tooltip title={success ? "Copied" : "Click to copy"}>
                                    <FileCopyOutlined
                                        fontSize={size}
                                        className={customIconClasses.root}
                                        color={color}
                                        onClick={() => copy(file)}
                                    // onClick={() => setOpenDialog(true)}
                                    />
                                </Tooltip>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
            <Dialog open={openDialog} onBackdropClick={() => setOpenDialog(false)}>
                <DialogTitle disableTypography>
                    <Typography variant="h3">Audio transcript</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {/* {transcript !== "" &&
              transcript.split("\n").map((item, index) => (
                <Typography paragraph key={index}>
                  {item}
                </Typography>
              ))} */}
                    <input></input>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default RegisPlayer;