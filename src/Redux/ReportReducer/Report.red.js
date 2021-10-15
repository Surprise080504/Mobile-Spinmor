import {
  MY_ORDERS_STATUS,
  SET_MY_ORDERS,
  //
  ORDER_DETAILS_STATUS,
  SET_ORDER_DETAILS,
} from "./Report.types";

import { status } from "../../api/api";

const initialState = {
  myOrders: [],
  myOrdersStatus: status.not_started,

  orderDetailsStatus: status.not_started,
  orderDetails: [],
};

const ReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case MY_ORDERS_STATUS: {
      return {
        ...state,
        myOrdersStatus: action.payload,
      };
    }

    case SET_MY_ORDERS: {
      return {
        ...state,
        myOrders: action.payload,
      };
    }

    //
    //

    case ORDER_DETAILS_STATUS: {
      return {
        ...state,
        orderDetailsStatus: action.payload,
      };
    }

    case SET_ORDER_DETAILS: {
      return {
        ...state,
        orderDetails: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default ReportReducer;
