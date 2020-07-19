import React, { useState, useEffect } from "react";

import {
  Button,
  Drawer,
  ListItemText,
  IconButton,
  ListItemIcon,
  ListItem,
  Divider,
  List,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  CssBaseline,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
} from "@material-ui/core";

import {
  PollRounded,
  EqualizerRounded,
  AddRounded,
  CloseRounded,
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { useSnackbar } from "notistack";

import { v4 as uuid } from "uuid";
import { DeviceUUID } from "device-uuid/index";

import WebConfig from "./web_config";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },

  paper: {
    padding: 15,
  },
  btn: {
    textTransform: "capitalize",
  },
}));

export default function CreatePoll(props) {
  const classes = useStyles();
  const history = useHistory();
  const { theme, themer } = props;
  const [options, setOptions] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState({ value: "", error: "" });
  const [opError, setOpError] = useState("");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    axios.defaults.baseURL = new WebConfig().BASE_URL;

    if (history.location.state != null) {
      setName(history.location.state.name);
    }
  }, []);

  const onDescChange = (e) => {
    if (e.target.value == "") {
      setDesc({ value: "", error: "Enter poll description here" });
    } else {
      setDesc({ value: e.target.value, error: "" });
    }
  };

  const onCreateClick = () => {
    if (desc.value == "") {
      setDesc({ value: "", error: "Write poll description" });
    } else if (options.length < 3) {
      setOpError("Add at least 3 options to create poll");
    } else {
      createPoll();
    }
  };

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const createPoll = () => {
    const pollsInstance = axios.create();

    console.log("Creating a poll .....");
    var myid = new DeviceUUID().get();
    var id1 = uuid().split("-");

    var id2 = id1[randomInteger(0, id1.length - 1)];
    const data = {
      id: id2,
      title: name,
      desc: desc.value,
      owner: myid,
      options: options,
    };

    pollsInstance
      .post("/api/create", data)
      .then(function (response) {
        const d = response.data;
        console.log(d);

        enqueueSnackbar(d.message, {
          variant: "success",
          action: (k) => (
            <IconButton
              onClick={() => {
                closeSnackbar(k);
              }}
            >
              <CloseRounded />
            </IconButton>
          ),
        });

        history.replace("/view/" + id2);
      })
      .catch(function (error) {
        console.log(error);
        var e = error.message;

        if (error.response) {
          e = error.response.data.error;
        }

        enqueueSnackbar(e, {
          variant: "error",
          action: (k) => (
            <IconButton
              onClick={() => {
                closeSnackbar(k);
              }}
            >
              <CloseRounded />
            </IconButton>
          ),
        });
      });
  };

  return (
    <div className={classes.root}>
      {/* Add new poll dialog */}
      {/* <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="sm">
        <DialogTitle>Add new poll</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create new poll, add options so that other people can come and vote.
          </DialogContentText>
          <TextField
            fullWidth
            placeholder="Enter poll name here"
            label="poll name"
            color="primary"
            variant="outlined"
            size="small"
          />
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={() => setNewOpen(false)}>
            Cancel
          </Button>
          <Button color="primary">Create</Button>
        </DialogActions>
      </Dialog> */}

      <main>
        <Container maxWidth="md">
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item sm={12} md={7}>
                <Typography variant="h5" gutterBottom>
                  Create new poll with title <b>{name}</b>
                </Typography>

                <Box mt={3}>
                  <TextField
                    id="name"
                    label="Poll name"
                    placeholder="Edit poll name here"
                    variant="outlined"
                    fullWidth
                    disabled
                    value={name}
                  />
                </Box>

                <Box mt={2}>
                  <TextField
                    id="desc"
                    label="Description"
                    placeholder="Reason for this poll?"
                    multiline
                    rowsMax={7}
                    rows={3}
                    variant="outlined"
                    fullWidth
                    onChange={onDescChange}
                    error={desc.error != ""}
                    helperText={desc.error}
                  />
                </Box>

                <Box mt={2}>
                  <Autocomplete
                    multiple
                    id="tags-filled"
                    options={[].map((option) => option)}
                    value={options}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() => {
                            options.splice(index, 1);
                            setOptions(options);
                          }}
                          // disabled={index <= 1}
                        />
                      ))
                    }
                    onChange={(event, newValue) => {
                      setOptions([
                        ...options,
                        ...newValue.filter(
                          (option) => options.indexOf(option) === -1
                        ),
                      ]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        margin="dense"
                        error={opError != ""}
                        helperText={opError}
                        {...params}
                        variant="outlined"
                        label="Poll options"
                        placeholder="Write poll and press enter."
                      />
                    )}
                  />
                </Box>

                <Box mt={2} display="flex" justify="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </Button>

                  <Box ml={2}>
                    <Button
                      variant="contained"
                      disableElevation
                      color="primary"
                      fullWidth
                      onClick={onCreateClick}
                    >
                      Create poll
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Paper>
        </Container>
      </main>
    </div>
  );
}
