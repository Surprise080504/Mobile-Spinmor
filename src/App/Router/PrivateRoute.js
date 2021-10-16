import React from "react";

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Route, Redirect } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: "100vw",
    height: "100vh",
    color: theme.palette.getContrastText(theme.palette.primary.main),
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer }) => ({
  token: AppReducer.token,
  initializationStatus: AppReducer.initializationStatus,
});
const mapDispatchToProps = () => ({});

//Show the component only when token exists and if initialization succeeded
//  if token does not exist redirect to /login
//  note that <AppRouter /> calls initializations APIs. If this fails, the token will be set to null and therefore this component will redirect to /login for that reason as well!
const PrivateRoute = ({ children, token, initializationStatus, ...rest }) => {
  const classes = useStyles();

  return (
    <Route {...rest}>
      {/*token ? children : <Redirect to="/login" />*/}
      {!token ? (
        <Redirect to="/login" />
      ) : initializationStatus !== status.finish ? (
        <Grid
          container
          direction="column"
          alignItems="center"
          alignContent="center"
          className={classes.root}
          justifyContent="space-evenly"
        >
          <Grid item>
            <Typography variant="h1" align="center">
              Welcome to Spinmor
            </Typography>
          </Grid>

          <Grid item>
            <CircularProgress color="inherit" size="3rem" />
          </Grid>
        </Grid>
      ) : (
        children
      )}
    </Route>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
