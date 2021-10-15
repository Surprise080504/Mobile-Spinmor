import {
  SET_IS_EXCHANGE_RATE_LOADING,
  SET_EXCHANGE_RATE_ERROR,
  SET_EXCHANGE_RATES,
  //
  SET_BASKET_DB_DATA,
  //
  SET_BASKET_ID,
  SET_BASKET_CURRENCY,
  SET_BASKET_LOCATION,
  //
  ADD_TO_BASKET_STATUS,
  CREATE_BASKET_STATUS,
  ADD_ITEM_TO_BASKET,
  //
  GET_BASKET_ITEMS_STATUS,
  SET_BASKET_ITEMS,
  CALC_BASKET_TAX,
  CALC_BASKET_TOTAL,
  EDIT_BASKET_ITEM,
  DELETE_BASKET_STATUS,
} from "./Basket.types";

import { axiosInstance, status } from "../../api/api";
import { setInitializationStatus } from "../AppReducer/App.act";

export const setBasketId = (basketId) => ({
  type: SET_BASKET_ID,
  payload: basketId,
});

export const setBasketCurrency = (basketCurrency) => ({
  type: SET_BASKET_CURRENCY,
  payload: basketCurrency,
});

export const setBasketLocation = (basketLocation) => ({
  type: SET_BASKET_LOCATION,
  payload: basketLocation,
});

export const setIsExchangeRateLoading = (isExchangeRateLoading) => ({
  type: SET_IS_EXCHANGE_RATE_LOADING,
  payload: isExchangeRateLoading,
});

export const setExchangeRateError = (exchangeRateError) => ({
  type: SET_EXCHANGE_RATE_ERROR,
  payload: exchangeRateError,
});

export const setExchangeRates = (exchangeRates) => ({
  type: SET_EXCHANGE_RATES,
  payload: exchangeRates,
});

//
//

export const setBasketDbData = (loginData) => ({
  type: SET_BASKET_DB_DATA,
  payload: loginData,
});

export const getExchangeRateAction = () => async (dispatch, getState) => {
  const initializationStatus = getState().AppReducer.initializationStatus;

  if (initializationStatus !== status.finish) {
    dispatch(setIsExchangeRateLoading(true));
  }

  try {
    const exchangeRateResponse = await axiosInstance({
      method: "get",
      url: "/Currency/ExchangeRate",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (exchangeRateResponse.data) {
      dispatch(setExchangeRates(exchangeRateResponse.data));

      const currentExchangeRateError = getState().BasketReducer
        .exchangeRateError;
      if (currentExchangeRateError) {
        dispatch(setExchangeRateError(null));
      }

      if (initializationStatus !== status.finish) {
        dispatch(setInitializationStatus(status.success_exchange));
      }
    } else {
      dispatch(setExchangeRateError(404));
      if (initializationStatus !== status.finish) {
        dispatch(setInitializationStatus(status.error_exchange));
      }
    }
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

    dispatch(setExchangeRateError(caughtError));

    if (initializationStatus !== status.finish) {
      dispatch(setInitializationStatus(status.error_exchange));
    }
  } finally {
    if (initializationStatus !== status.finish) {
      dispatch(setIsExchangeRateLoading(false));
    }
  }
};

//
//

export const setAddToBasketStatus = (addToBasketStatus) => ({
  type: ADD_TO_BASKET_STATUS,
  payload: addToBasketStatus,
});

export const setCreateBasketStatus = (createBasketStatus) => ({
  type: CREATE_BASKET_STATUS,
  payload: createBasketStatus,
});

export const editBasketItem = (editedBasketItem) => ({
  type: EDIT_BASKET_ITEM,
  payload: editedBasketItem,
});

export const addItemToBasket = (options = {}) => async (dispatch, getState) => {
  const { editedInBasket = false } = options;
  dispatch(setAddToBasketStatus(status.loading));

  const data = {};
  if (editedInBasket) {
    data.QRcode = getState().BasketReducer.editedBasketItem.qr;
    data["Quantity "] = getState().BasketReducer.editedBasketItem.qty;
  } else {
    data.QRcode = getState().ScannerReducer.scanResult;
    data["Quantity "] = getState().ScannerReducer.qty;
  }
  console.log(data);

  let totalPriceRes = 0.0;
  let totalTaxRes = 0.0;
  let locationRes = null;
  try {
    const addToBasketResponse = await axiosInstance({
      method: "post",
      url: "/api/Add2Basket",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      data,
      withCredentials: true,
    });

    if (addToBasketResponse.data) {
      totalPriceRes = addToBasketResponse.data.TotalPriceIncludingTax;
      totalTaxRes = addToBasketResponse.data.TotalTax;
      locationRes = addToBasketResponse.LocationName;
    } else {
      dispatch(setAddToBasketStatus(`${status.error} 404`));
      return;
    }
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

    dispatch(setAddToBasketStatus(`${status.error} ${caughtError}`));
    return;
  }

  //
  dispatch({
    type: ADD_ITEM_TO_BASKET,
    payload: {
      // basketItems: newItems,
      // totalQty,
      totalPrice: totalPriceRes,
      totalTax: totalTaxRes,
    },
  });
  if (locationRes) {
    dispatch(setBasketLocation(locationRes));
  }

  dispatch(setAddToBasketStatus(status.finish));
};

//
//

export const setGetBasketItemsStatus = (getBasketItemsStatus) => ({
  type: GET_BASKET_ITEMS_STATUS,
  payload: getBasketItemsStatus,
});

export const calcBasketTax = () => async (dispatch, getState) => {
  const basketItems = getState().BasketReducer.basketItems;

  let calculatedTax = 0.0;
  for (let i = 0; i < basketItems.length; i++) {
    calculatedTax += basketItems[i].Tax * basketItems[i].Quantity;
  }

  dispatch({
    type: CALC_BASKET_TAX,
    payload: calculatedTax,
  });
};

export const calcBasketTotal = () => async (dispatch, getState) => {
  const basketItems = getState().BasketReducer.basketItems;

  let calculatedTotalAmount = 0.0;
  for (let i = 0; i < basketItems.length; i++) {
    calculatedTotalAmount +=
      basketItems[i].TaxIncluded * basketItems[i].Quantity;
  }

  dispatch({
    type: CALC_BASKET_TOTAL,
    payload: calculatedTotalAmount,
  });
};

export const getBasketItemsAction = () => async (dispatch, getState) => {
  dispatch(setGetBasketItemsStatus(status.loading));

  try {
    const getBasketItemsRes = await axiosInstance({
      method: "get",
      url: "/api/GetBasketItems",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (getBasketItemsRes.data) {
      dispatch({
        type: SET_BASKET_ITEMS,
        payload: Array.isArray(getBasketItemsRes.data)
          ? getBasketItemsRes.data
          : [],
      });

      dispatch(setBasketId(getBasketItemsRes.data[0]?.BasketId));
      dispatch(setGetBasketItemsStatus(status.finish));

      dispatch(calcBasketTax());
      dispatch(calcBasketTotal());
    } else {
      dispatch(setGetBasketItemsStatus(`${status.error} 404`));
      return;
    }
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

    dispatch(setGetBasketItemsStatus(`${status.error} ${caughtError}`));
    return;
  }
};

export const setDeleteBasketStatus = (deleteBasketStatus) => ({
  type: DELETE_BASKET_STATUS,
  payload: deleteBasketStatus,
});

export const deleteBasketAction = () => async (dispatch, getState) => {
  dispatch(setDeleteBasketStatus(status.loading));

  try {
    const deleteBasketRes = await axiosInstance({
      method: "delete",
      url: "/api/DeleteBasket",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (deleteBasketRes.data) {
      if (deleteBasketRes.data !== "OK") {
        dispatch(setDeleteBasketStatus(`${status.error} 500`));
        return;
      }

      dispatch(setDeleteBasketStatus(status.finish));
    } else {
      dispatch(setDeleteBasketStatus(`${status.error} 404`));
      return;
    }
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

    dispatch(setDeleteBasketStatus(`${status.error} ${caughtError}`));
    return;
  }
};
