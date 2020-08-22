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
  Toolbar,
  AppBar,
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
  MenuItem,
  Avatar,
  Menu,
  useMediaQuery,
} from "@material-ui/core";

import {
  MenuRounded,
  BrightnessHighRounded,
  Brightness4Rounded,
  PollRounded,
  EqualizerRounded,
  AddRounded,
  CloseRounded,
  ArrowDropDownRounded,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
} from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Route, Switch, Link } from "react-router-dom";
import GoogleLogin from "react-google-login";

import { useHistory } from "react-router-dom";

import Polls from "./polls";
import CreatePoll from "./create";
import View from "./view";
import { useSnackbar } from "notistack";

import { v4 as uuid } from "uuid";

const social = [
  {
    name: "Facebook",
    icon: <Facebook />,
    link: "https://web.facebook.com/regissaffi/",
  },
  {
    name: "Twitter",
    icon: <Twitter />,
    link: "https://twitter.com/regissaffi",
  },
  {
    name: "LinkedIn",
    icon: <LinkedIn />,
    link: "https://www.linkedin.com/in/regis-saffi/",
  },
  {
    name: "Instagram",
    icon: <Instagram />,
    link: "https://www.instagram.com/regissaffi/",
  },
  { name: "GitHub", icon: <GitHub />, link: "https://github.com/RegisSaffi" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 100,
  },
  grow: {
    flexGrow: 1,
  },
  btn: {
    textTransform: "capitalize",
  },
}));

const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Polls />,
  },
  {
    path: "/polls",
    exact: true,
    main: () => <Polls />,
  },
  {
    path: "/create",
    exact: true,
    main: () => <CreatePoll />,
  },
  {
    path: "/view/:id",
    exact: false,
    main: () => <View />,
  },
  {
    path: "/mine",
    exact: true,
    main: () => <Polls />,
  },
  {
    main: () => (
      <Container maxWidth="sm">
        <Box border={1} borderRadius="borderRadius" p={3}>
          <Typography align="center">
            The page you requested is not found
          </Typography>
        </Box>
      </Container>
    ),
  },
];

export default function Home(props) {
  const classes = useStyles();
  const { theme, themer } = props;
  const history = useHistory();
  const Theme = useTheme();

  const [signinOpen, setSigninOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [token, setToken] = useState({});

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (n) => {
    setAnchorEl(null);

    if (n == 1) {
      localStorage.removeItem("crf_data");
      localStorage.setItem("crf_token", uuid());
      setToken({});

      history.replace("/polls");

      enqueueSnackbar("Logged out.", {
        variant: "info",
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
      setAboutOpen(true);
    }
  };

  useEffect(() => {
    const tok = localStorage.getItem("crf_token");
    if (!tok.includes("-")) {
      const d = localStorage.getItem("crf_data");
      setToken({ token: tok, data: JSON.parse(d) });
    }
  }, []);

  const responseGoogle = (response) => {
    console.log(response);

    const name = response.profileObj.name;
    const email = response.profileObj.email;
    const image = response.profileObj.imageUrl;
    const gid = response.profileObj.googleId;

    var data = { name: name, email: email, image: image };
    setToken({ token: gid, data: data });
    localStorage.setItem("crf_token", gid);
    localStorage.setItem("crf_data", JSON.stringify(data));
    setSigninOpen(false);
    history.replace("/polls");
  };

  const errorGoogle = (error) => {
    console.log(error);

    enqueueSnackbar("Google login failed, try again later.", {
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
  };

  const socialClick = (link) => {
    window.open(link, "_blank");
  };

  const matches = useMediaQuery(Theme.breakpoints.up("sm"));

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* Add new poll dialog */}
      <Dialog
        open={signinOpen}
        onClose={() => setSigninOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Sign in with google</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sign in with google so that you can be able to create and manage
            your own polls or add items to others's
          </DialogContentText>

          <Box mt={2} display="flex" justifyContent="center">
            <GoogleLogin
              clientId="287971979617-hjnln18juotljv1kkgemtv9jl8r05mq2.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={responseGoogle}
              onFailure={errorGoogle}
              cookiePolicy={"single_host_origin"}
              style={{ borderRadius: 25 }}
              theme={theme == 0 ? "light" : "dark"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setSigninOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* jhcccccccccccccccccccccc */}

      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>About AnyPolls</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography p>
              This application was created for educational purpose by
              <b> Regis saffi</b>, it can help anyone to create polls and get
              votes counts and percentages.
            </Typography>
            <Typography p gutterBottom>
              You can still vote even if you don't have an account, but to
              create your own polls and add options to other's, you need to
              login with your google account.
            </Typography>

            <Typography p>
              Although all votes might not precisely unique, but you can vote
              only once per poll.
            </Typography>

            <Typography p variant="subtitle1">
              If you find this helpful, you can hookup with me on social medias
              because
            </Typography>
          </DialogContentText>

          <Box mt={2} display="flex" justifyContent="center">
            <Typography variant="h6" align="center" gutterBottom>
              I am social:
            </Typography>

            <Box mt={3}>
              {social.map((s, i) => (
                <IconButton onClick={() => socialClick(s.link)}>
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setAboutOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Box mr={2}>
            <PollRounded color="inherit" color="inherit" />
          </Box>

          <Typography
            variant="h6"
            color="inherit"
            align="left"
            className={classes.grow}
          >
            AnyPolls
          </Typography>
          <Button
            color="inherit"
            style={{ marginRight: 10 }}
            onClick={() => history.push("/")}
            className={classes.btn}
          >
            Home
          </Button>

          <IconButton
            color="inherit"
            onClick={() => themer()}
            style={{ marginRight: 10 }}
          >
            {theme == 1 ? <BrightnessHighRounded /> : <Brightness4Rounded />}
          </IconButton>
          {token.token == null ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setSigninOpen(true)}
              style={{ borderRadius: 25 }}
              className={classes.btn}
            >
              <Typography noWrap color="secondary">
                {" "}
                Sign in
              </Typography>
            </Button>
          ) : (
            <div>
              <Button
                onClick={handleMenu}
                color="inherit"
                size="small"
                className={classes.btn}
                startIcon={<Avatar src={token.data.image}></Avatar>}
                endIcon={matches ? <ArrowDropDownRounded /> : null}
              >
                {matches && (
                  <Typography className={classes.name} noWrap>
                    {token.data.name}
                  </Typography>
                )}
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={menuOpen}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleClose(0)}>About</MenuItem>
                <MenuItem onClick={() => handleClose(1)}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Switch>
        {routes.map((route, i) => (
          <Route exact={route.exact} path={route.path} component={route.main} />
        ))}
      </Switch>
    </div>
  );
}
