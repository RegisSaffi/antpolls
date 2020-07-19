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
} from "@material-ui/core";

import {
  PollRounded,
  EqualizerRounded,
  AddRounded,
  CloseRounded,
} from "@material-ui/icons";

import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import WebConfig from "./web_config";
import { useSnackbar } from "notistack";
import { DeviceUUID } from "device-uuid/index";

import axiosRetry from "axios-retry";
const axios = require("axios");
axiosRetry(axios, { retries: 3 });

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

  action: {
    borderRadius: 15,
  },
  card: {
    borderRadius: 15,
  },
  btn2: {
    borderRadius: 15,
  },
}));

export default function Polls(props) {
  const classes = useStyles();
  const { theme, themer } = props;
  const [polls, setPolls] = useState([]);
  const [newOpen, setNewOpen] = useState();
  const history = useHistory();

  const [name, setname] = useState({ value: "", error: "" });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [token, setToken] = useState({});

  const onNameChange = (e) => {
    if (e.target.value == "") {
      setname({ value: "", error: "Enter poll name here" });
    } else {
      setname({ value: e.target.value, error: "" });
    }
  };

  const onCreateClick = () => {
    if (name.value == "") {
      setname({ value: "", error: "Enter poll name here please" });
    } else {
      history.push("/create", { name: name.value });
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = new WebConfig().BASE_URL;

    const tok = localStorage.getItem("crf_token");
    if (tok != null) {
      if (!tok.includes("-")) {
        const d = localStorage.getItem("crf_data");
        setToken({ token: tok, data: JSON.parse(d) });
      }
    }

    getPolls();
  }, []);

  const getPolls = () => {
    const pollsInstance = axios.create();

    console.log("getting polls .....");

    pollsInstance
      .get("/api/polls")
      .then(function (response) {
        const d = response.data;

        if (d.length != 0) {
          setPolls(d);
        } else {
          setPolls([]);
          enqueueSnackbar(
            "There are no polls available yet, you can start by creating one.",
            {
              variant: "info",
              key: "8900",
              persist: true,
              action: (k) => (
                <IconButton
                  onClick={() => {
                    closeSnackbar(k);
                  }}
                >
                  <CloseRounded />
                </IconButton>
              ),
            }
          );
        }
      })
      .catch(function (error) {
        console.log(error);
        var e = error.message;

        if (error.response) {
          e = error.response.data.error;
        }

        enqueueSnackbar(e, {
          variant: "error",
          key: "8900",
          persist: true,
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
      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="sm">
        <DialogTitle>Add new poll</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create new poll, add options so that other people can come and vote.
          </DialogContentText>
          <TextField
            fullWidth
            placeholder="Enter poll name here"
            label="poll name"
            variant="outlined"
            size="small"
            error={name.error != ""}
            helperText={name.error}
            onChange={onNameChange}
          />
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={() => setNewOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onCreateClick}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <main>
        <Container maxWidth="md">
          <Box>
            <Box
              mb={3}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Box
                mt={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box mr={2}>
                  <PollRounded fontSize="large" />
                </Box>
                <Typography variant="h4" align="center">
                  Welcome to AnyPolls
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="textSecondary"
                align="center"
              >
                Online smart voting made easy,select a poll to see the results
                and vote, or sign-in to make a new poll.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {token.token != null ? (
                <Grid item xs={6} sm={4} md={4} lg={2}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <CardActionArea
                      className={classes.action}
                      onClick={() => setNewOpen(true)}
                    >
                      <Box
                        height="150px"
                        width={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        border={1}
                        borderStyle="dotted"
                        borderRadius="borderRadius"
                        borderColor="grey.300"
                        className={classes.btn2}
                      >
                        <AddRounded fontSize="large" />
                      </Box>
                    </CardActionArea>
                    <Box mt={1}>
                      <Typography color="inherit">Add new</Typography>
                      <Typography color="textSecondary" variant="caption">
                        New poll
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ) : (
                <div />
              )}

              {polls.length === 0
                ? [1, 2, 3, 4, 5].map((o, i) => (
                    <Grid item xs={6} sm={4} md={4} lg={2}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={15}
                        width={1}
                      >
                        <Skeleton
                          variant="rect"
                          height={150}
                          width={"100%"}
                          style={{ borderRadius: 15 }}
                        />

                        <Skeleton
                          variant="text"
                          width={"68%"}
                          style={{ borderRadius: 7 }}
                        />
                        <Skeleton
                          variant="text"
                          width={"40%"}
                          height={8}
                          style={{ borderRadius: 7 }}
                        />
                      </Box>
                    </Grid>
                  ))
                : polls.map((item, i) => (
                    <Grid item xs={6} sm={4} md={4} lg={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <CardActionArea
                          className={classes.action}
                          onClick={() => {
                            history.push("/view/" + item.id);
                          }}
                        >
                          <Paper className={classes.card} elevation={0}>
                            <Box
                              height="150px"
                              width={1}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              flexDirection="column"
                              border={0}
                              borderRadius="borderRadius"
                              borderColor="grey.300"
                            >
                              <EqualizerRounded fontSize="large" />
                            </Box>
                          </Paper>
                        </CardActionArea>
                        <Box mt={1}>
                          <Typography color="inherit" noWrap>
                            {item.name}
                          </Typography>
                          <Typography color="textSecondary" variant="caption">
                            votes: {item.votes}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
            </Grid>
          </Box>
        </Container>
      </main>
    </div>
  );
}
