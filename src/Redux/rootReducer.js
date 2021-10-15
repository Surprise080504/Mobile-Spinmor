import { combineReducers } from "redux";

import { LOGOUT } from "./AppReducer/App.types";

import AppReducer from "./AppReducer/App.red";
import ScannerReducer from "./ScannerReducer/Scanner.red";
import BasketReducer from "./BasketReducer/Basket.red";
import PaymentReducer from "./PaymentReducer/Payment.red";
import ReportReducer from "./ReportReducer/Report.red";

// export default combineReducers({
//   AppReducer,
//   ScannerReducer,
//   BasketReducer,
// });

const appReducer = combineReducers({
  AppReducer,
  ScannerReducer,
  BasketReducer,
  PaymentReducer,
  ReportReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
