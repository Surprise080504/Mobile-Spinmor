import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Switch, Redirect } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Login from "../../Screens/Login";
import AppBarNav from "../../Components/Navigation/AppBarNav";
import Scanner from "../../Screens/Scanner";
import Basket from "../../Screens/Basket";
import Reviews from "../../Screens/Reviews";
import Payment from "../../Screens/Payment";
import Orders from "../../Screens/Orders";

import {
  loginAction,
  setInitializationStatus,
  logout,
} from "../../Redux/AppReducer/App.act";
import { getExchangeRateAction } from "../../Redux/BasketReducer/Basket.act";
import { status } from "../../api/api";

const mapStateToProps = ({ AppReducer }) => ({
  token: AppReducer.token,
  initializationStatus: AppReducer.initializationStatus,
});
const mapDispatchToProps = (dispatch) => ({
  loginAction: bindActionCreators(loginAction, dispatch),
  getExchangeRateAction: bindActionCreators(getExchangeRateAction, dispatch),
  setInitializationStatus: bindActionCreators(
    setInitializationStatus,
    dispatch
  ),
  logout: bindActionCreators(logout, dispatch),
});

const AppRouter = ({
  token,
  initializationStatus,
  loginAction,
  getExchangeRateAction,
  setInitializationStatus,
  logout,
}) => {
  React.useEffect(() => {
    console.log("initializationStatus:", initializationStatus);

    if (!token) {
      return;
    }

    if (initializationStatus === status.finish) {
      return;
    }

    if (
      initializationStatus === status.error_login || //uncomment this line when login works fine
      initializationStatus === status.error_exchange
    ) {
      logout();
      return;
    }

    if (initializationStatus === status.not_started) {
      loginAction();
    }

    if (
      // initializationStatus === status.error_login || //comment this line when login works fine
      initializationStatus === status.success_login
    ) {
      getExchangeRateAction();
    }

    if (initializationStatus === status.success_exchange) {
      setInitializationStatus(status.finish);
    }
  }, [
    token,
    initializationStatus,
    logout,
    loginAction,
    getExchangeRateAction,
    setInitializationStatus,
  ]);

  return (
    <React.Fragment>
      {initializationStatus === status.finish && (
        <React.Fragment>
          <AppBarNav />
        </React.Fragment>
      )}

      <Switch>
        <Redirect
          //this Redirect removes trailing slashes
          from="/:url*(/+)"
          to={window.location.pathname.slice(0, -1)}
        />

        <PrivateRoute exact path="/">
          <Scanner />
        </PrivateRoute>

        <PrivateRoute exact path="/basket">
          <Basket />
        </PrivateRoute>

        <PrivateRoute exact path="/payment">
          <Payment />
        </PrivateRoute>

        <PrivateRoute exact path="/orders">
          <Orders />
        </PrivateRoute>

        <PrivateRoute exact path="/reviews/:itemId?">
          <Reviews />
        </PrivateRoute>

        <PublicRoute restricted={true} exact path="/login">
          <Login />
        </PublicRoute>

        <PublicRoute path="*">
          <h1>error page</h1>
        </PublicRoute>
      </Switch>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
