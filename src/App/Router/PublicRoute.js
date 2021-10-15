import React from "react";

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Route, Redirect } from "react-router-dom";

const mapStateToProps = ({ AppReducer }) => ({
  token: AppReducer.token,
});
const mapDispatchToProps = () => ({});

const PublicRoute = ({
  component: Component,
  children,
  restricted,
  token,
  ...rest
}) => {
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      // render={(props) =>
      //   isLogin() && restricted ? (
      //     <Redirect to="/dashboard" />
      //   ) : (
      //     <Component {...props} />
      //   )
      // }
    >
      {token && restricted ? <Redirect to="/" /> : children}
    </Route>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicRoute);
