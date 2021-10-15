import {
  MY_ORDERS_STATUS,
  SET_MY_ORDERS,
  //
  ORDER_DETAILS_STATUS,
  SET_ORDER_DETAILS,
} from "./Report.types";

import { status, axiosInstance } from "../../api/api";

export const setMyOrdersStatus = (myOrdersStatus) => ({
  type: MY_ORDERS_STATUS,
  payload: myOrdersStatus,
});

export const setMyOrders = (myOrders) => ({
  type: SET_MY_ORDERS,
  payload: myOrders,
});

export const getMyOrdersAction = () => async (dispatch, getState) => {
  dispatch(setMyOrdersStatus(status.loading));

  try {
    const myOrdersRes = await axiosInstance({
      method: "get",
      url: "/reports/MyOrders",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    dispatch(setMyOrders(myOrdersRes.data));
    dispatch(setMyOrdersStatus(status.finish));
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setMyOrdersStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setOrderDetailsStatus = (orderDetailsStatus) => ({
  type: ORDER_DETAILS_STATUS,
  payload: orderDetailsStatus,
});

export const setOrderDetails = (orderDetails) => ({
  type: SET_ORDER_DETAILS,
  payload: orderDetails,
});

export const getOrderDetailsAction = (orderId) => async (
  dispatch,
  getState
) => {
  dispatch(setOrderDetailsStatus(status.loading));

  try {
    const orderDetailsRes = await axiosInstance({
      method: "get",
      url: "/reports/MyOrderDetails",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        OrdersId: orderId,
      },
    });

    dispatch(setOrderDetails(orderDetailsRes.data));
    dispatch(setOrderDetailsStatus(status.finish));
  } catch (error) {
    let caughtError = 500;

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      caughtError = error.response.status;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    dispatch(setOrderDetailsStatus(`${status.error} ${caughtError}`));
    return;
  }
};
