import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import EmailIcon from "@material-ui/icons/Email";

import { tokenAction } from "../Redux/AppReducer/App.act";
import { status } from "../api/api";
import spinmorLogo from "../Assets/images/logo.jpeg";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    minWidth: "100%",
  },
  textField: {
    minWidth: 300,
  },

  inputContainer: {
    minHeight: 250,
  },
  logoContainer: {
    position: "absolute",
    top: 24,
    left: 24,
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  isTokenCallLoading: AppReducer.isTokenCallLoading,
  tokenCallError: AppReducer.tokenCallError,
  initializationStatus: AppReducer.initializationStatus,
});
const mapDispatchToProps = (dispatch) => ({
  tokenAction: bindActionCreators(tokenAction, dispatch),
});

function Login({
  isTokenCallLoading,
  tokenCallError,
  tokenAction,
  initializationStatus,
}) {
  const classes = useStyles();

  const [email, setEmail] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    tokenAction(email, password);
  };

  return (
    <Grid
      container
      justify="space-evenly"
      alignItems="center"
      alignContent="center"
      className={classes.root}
      direction="column"
    >
      <div className={classes.logoContainer}>
        <a href="https://www.spinmor.com/" target="_blank" rel="noreferrer">
          <img src={spinmorLogo} alt="logo" height={96} />
        </a>
      </div>

      <Grid item>
        <Typography variant="h3" component="h1" align="center">
          Please login to continue
          <br />
          Scan. Click. Pay
        </Typography>
      </Grid>

      <Grid item>
        {isTokenCallLoading && (
          <CircularProgress style={{ alignSelf: "center" }} size="3rem" />
        )}

        {tokenCallError && (
          <Typography>An error while logging in: {tokenCallError}</Typography>
        )}

        {localStorage.getItem("@initializationStatus") ===
          status.error_exchange && (
          <Typography>
            An error while getting exchange rates, please try again
          </Typography>
        )}

        {localStorage.getItem("@initializationStatus") ===
          status.error_login && (
          <Typography>
            An error while getting your info, please try again
          </Typography>
        )}
      </Grid>

      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justify="space-between"
        className={classes.inputContainer}
      >
        <form autoComplete="on" onSubmit={handleLogin}>
          <Grid item>
            <TextField
              value={email}
              label="email"
              // type="email"
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              className={classes.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <TextField
              value={password}
              label="password"
              type={showPassword ? "text" : "password"}
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              className={classes.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prevVal) => !prevVal)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item style={{ alignSelf: "center" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isTokenCallLoading}
            >
              login
            </Button>
          </Grid>
        </form>

        {/*<Grid
          container
          item
          direction="row"
          justify="space-between"
          alignItems="center"
          xl={4}
          lg={4}
          md={4}
          sm={6}
          xs={12}
        >
          <Grid item>
            <Button variant="outlined" color="primary">
              Forgot password
            </Button>
          </Grid>

          <Grid item>
            <Button variant="outlined" color="primary">
              Register
            </Button>
          </Grid>
        </Grid>*/}
      </Grid>
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
