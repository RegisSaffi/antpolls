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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemSecondaryAction,
  TextField,
} from "@material-ui/core";

import {
  PollRounded,
  EqualizerRounded,
  AddRounded,
  AcUnitRounded,
  RadioButtonUncheckedRounded,
  CheckCircleRounded,
  CloseRounded,
  DeleteRounded,
} from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Chart from "react-apexcharts";

import { useHistory, useParams } from "react-router-dom";

import { useSnackbar } from "notistack";
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
  btnd: {
    textTransform: "capitalize",
    color: theme.palette.error.main,
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

export default function View(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const Theme = useTheme();

  // const onCreateClick = () => {
  //   if (name.value == "") {
  //     setname({ value: "", error: "Enter poll name here please" });
  //   } else {
  //     history.push("/create", { name: name.value });
  //   }
  // };

  const [pollData, setPollData] = useState({});

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [token, setToken] = useState({});

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [myid, setId] = useState([]);

  const [newOpen, setNewOpen] = useState();
  const [option, setOption] = useState({ value: "", error: "" });

  useEffect(() => {
    axios.defaults.baseURL = new WebConfig().BASE_URL;

    const tok = localStorage.getItem("crf_token");

    if (tok != null) {
      if (!tok.includes("-")) {
        const d = localStorage.getItem("crf_data");
        setToken({ token: tok, data: JSON.parse(d) });
      }
    }

    const t = window.localStorage.getItem("theme");
    if (t != null) {
      optionsPerform.options.plotOptions["theme"] = {
        mode: t == 0 ? "light" : "dark",
      };

      var i = new DeviceUUID().get();
      setId(i);
    }

    getPoll();
  }, []);

  const onOptionChange = (e) => {
    if (e.target.value == "") {
      setOption({ value: "", error: "Enter poll option here" });
    } else {
      setOption({ value: e.target.value, error: "" });
    }
  };

  const onCreateClick = () => {
    if (option.value == "") {
      setOption({ value: "", error: "Enter poll option here" });
    } else {
      addOption();
      setNewOpen(false);
    }
  };
  ////////////

  const optionsPerform = {
    series: series,
    options: {
      theme: {
        mode: Theme.palette.type == "light" ? "light" : "dark",
      },
      labels: labels,
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
      },
      chart: {
        background: Theme.palette.background.default,
      },
      plotOptions: {
        noData: {
          text: "There are no data yet",
        },

        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: "Total",
                fontSize: 12,
              },
              value: {
                showAlways: true,
                show: true,
                formatter: function (v) {
                  return v + " Votes";
                },
              },
              name: {
                show: true,
                fontSize: 12,
              },
            },
          },
        },
      },
    },
  };
  ///////////////////////////

  const getPoll = () => {
    const pollInstance = axios.create();

    var myid = new DeviceUUID().get();
    console.log("getting poll data .....");

    pollInstance
      .get("/api/view/" + myid + "/polls/" + id)
      .then(function (response) {
        const d = response.data;
        console.log(d);

        if (d !== "") {
          setPollData(d);
          setLabels(d.data.options);
          setSeries(d.series);
        } else {
          enqueueSnackbar("This poll does not exist please, try another one.", {
            variant: "warning",
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

  /////////////////////////

  const votePoll = (d) => {
    const pollsInstance = axios.create();

    console.log("Voting poll .....");

    const data = {
      id: pollData.data.id,
      voter: d,
    };
    pollsInstance
      .post("/api/vote", data)
      .then(function (response) {
        const d = response.data;
        console.log(d);

        if (d !== "") {
          setPollData(d);
          setLabels(d?.data?.options);
          setSeries(d?.series);

          enqueueSnackbar("Voted", {
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
        } else {
          enqueueSnackbar("This poll does not exist please, try another one.", {
            variant: "warning",
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
        }
      })
      .catch(function (error) {
        console.log(error);
        var e = error.message;

        if (e == undefined) {
          e = "Unresolved error, or poll does not exist.";
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

  const addOption = () => {
    const pollsInstance = axios.create();

    const data = {
      id: pollData.data.id,
      userid: myid,
      option: option.value,
    };
    pollsInstance
      .post("/api/addOption", data)
      .then(function (response) {
        const d = response.data;
        console.log(d);

        if (d !== "") {
          setPollData(d);
          setLabels(d.data.options);
          setSeries(d.series);

          enqueueSnackbar("Option added", {
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
        } else {
          enqueueSnackbar("This poll does not exist please, try another one.", {
            variant: "warning",
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

  const deletePoll = () => {
    const pollsInstance = axios.create();

    const data = {
      id: pollData.data.id,
    };
    pollsInstance
      .post("/api/delete", data)
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

        history.replace("/");
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

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete poll"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your poll?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => deletePoll()} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* //////////////////////// */}

      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="sm">
        <DialogTitle>Add poll option</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add new poll option to this poll, you can do it even on other's
            polls
          </DialogContentText>
          <TextField
            fullWidth
            placeholder="Enter option here"
            label="poll option"
            variant="outlined"
            size="small"
            error={option.error != ""}
            helperText={option.error}
            onChange={onOptionChange}
          />
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={() => setNewOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onCreateClick}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <main>
        <Container maxWidth="md">
          <Box>
            <Box
              mb={4}
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
                  <EqualizerRounded fontSize="large" />
                </Box>
                <Typography variant="h4" align="center">
                  {pollData.data != null ? (
                    pollData.data?.name
                  ) : (
                      <Skeleton
                        variant="text"
                        width={200}
                        style={{ borderRadius: 7 }}
                      />
                    )}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography
                  variant="caption"
                  color="textSecondary"
                  align="center"
                >
                  {pollData.data != null ? (
                    pollData.data?.desc
                  ) : (
                      <Skeleton
                        variant="text"
                        height={9}
                        width={230}
                        style={{ borderRadius: 7 }}
                      />
                    )}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <List>
                  {pollData.data != null
                    ? pollData.data?.options.map((item, i) => (
                      <ListItem button>
                        <ListItemIcon>
                          <AcUnitRounded />
                        </ListItemIcon>
                        <ListItemText primary={item} />

                        <ListItemSecondaryAction>
                          <IconButton
                            disabled={pollData.voted.count != 0}
                            color="secondary"
                            onClick={() => {
                              var d = {
                                userid: myid,
                                index: i,
                              };
                              votePoll(d);
                            }}
                          >
                            {pollData?.voted.index == i ? (
                              <CheckCircleRounded />
                            ) : (
                                <RadioButtonUncheckedRounded />
                              )}
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                    : [1, 2, 3, 4, 5].map((item, i) => (
                      <ListItem>
                        <ListItemIcon>
                          <Skeleton variant="circle" width={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Skeleton
                              variant="text"
                              width={"100%"}
                              style={{ borderRadius: 7 }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                </List>
                <Box mt={3} display="flex" justifyContent="space-evenly">
                  {pollData?.voted?.count == 0 && token.token != null && (
                    <Button
                      className={classes.btn}
                      startIcon={<AddRounded />}
                      onClick={() => setNewOpen(true)}
                    >
                      Add new options
                    </Button>
                  )}

                  {pollData?.data?.owner == myid && (
                    <Button
                      className={classes.btnd}
                      startIcon={<DeleteRounded />}
                      onClick={() => setDeleteOpen(true)}
                      disabled={pollData?.data == null}
                    >
                      Delete poll
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  height={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {pollData.data != null ? (
                    <Chart
                      options={optionsPerform.options}
                      series={optionsPerform.series}
                      type="donut"
                      height={350}
                    />
                  ) : (
                      <Box>
                        {" "}
                        <Skeleton variant="circle" height={250} width={250} />
                        <Skeleton
                          variant="text"
                          height={9}
                          width={200}
                          style={{ borderRadius: 7, marginTop: 10 }}
                        />
                      </Box>
                    )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </main>
    </div>
  );
}
