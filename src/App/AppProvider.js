import React from "react";
import PropTypes from "prop-types";

import { applyMiddleware, createStore, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
// import { createLogger } from "redux-logger";

import { BrowserRouter as Router } from "react-router-dom";

import rootReducer from "../Redux/rootReducer";

import AppTheme from "./AppTheme";
import AppRouter from "./Router/AppRouter";

// const logger = createLogger({
//   diff: true,
// });

const middlewareArray = [thunk];
const middleware = applyMiddleware(...middlewareArray);
const composedEnhancers = compose(middleware);

const AppProvider = () => {
  return (
    <Provider store={createStore(rootReducer, composedEnhancers)}>
      <AppTheme>
        <Router>
          <AppRouter />
        </Router>
      </AppTheme>
    </Provider>
  );
};

AppProvider.propTypes = {
  //passed
  app: PropTypes.object,
};

export default AppProvider;
