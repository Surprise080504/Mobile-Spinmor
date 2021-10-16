import {
  SCANNER_READY_ONCE,
  SET_SCAN_DELAY,
  SET_IS_SCAN_SUCCESS,
  SET_SCAN_RESULT,
  SET_SCAN_ERROR,
  //
  GET_ITEM_LOADING,
  GET_ITEM_ERROR,
  SET_QR_ITEM,
  SET_QR_LOCATION,
  //
  SET_QTY,
  SET_IS_INPUT_EMPTY,
  //
  GET_ITEM_LIKES_STATUS,
  SET_ITEM_LIKES,
  GET_ITEM_REVIEWS_STATUS,
  SET_ITEM_REVIEWS,
} from "./Scanner.types";

import { defaultScanDelay } from "../../Assets/consts";
import { axiosInstance, status } from "../../api/api";
import { setBasketLocation } from "../BasketReducer/Basket.act";
import { setProdStatus } from "../AppReducer/App.act";

export const setScannerReadyOnce = (scannerReadyOnce = true) => ({
  type: SCANNER_READY_ONCE,
  payload: scannerReadyOnce,
});

export const setScanDelay = (delay) => ({
  type: SET_SCAN_DELAY,
  payload: delay,
});

export const setIsScanSuccess = (isScanSuccess) => ({
  type: SET_IS_SCAN_SUCCESS,
  payload: isScanSuccess,
});

export const setScanResult = (scanResult) => ({
  type: SET_SCAN_RESULT,
  payload: scanResult,
});

export const setScanError = (scanError) => ({
  type: SET_SCAN_ERROR,
  payload: scanError,
});

export const handleScan = (data) => (dispatch) => {
  if (!data) {
    return;
  }

  dispatch(setScanDelay(false));
  dispatch(setScanResult(data));
  dispatch(setScanError(null));
  dispatch(setIsScanSuccess(true));
};

//
//
export const setGetItemLoading = (getItemLoading) => ({
  type: GET_ITEM_LOADING,
  payload: getItemLoading,
});

export const setGetItemError = (getItemError) => ({
  type: GET_ITEM_ERROR,
  payload: getItemError,
});

export const setQrItem = (qrItem) => ({
  type: SET_QR_ITEM,
  payload: qrItem,
});

export const setQrLocation = (qrLocation) => ({
  type: SET_QR_LOCATION,
  payload: qrLocation,
});

export const getItemByQr = () => async (dispatch, getState) => {
  const { scanResult, scanError } = getState().ScannerReducer;

  if (scanError || !scanResult || scanResult === "no result") {
    console.debug("getItemByQr not initiated because of flags");
    return;
  }

  dispatch(setGetItemLoading(true));

  try {
    const getItemListResponse = await axiosInstance({
      method: "get",
      url: "/api/GetItemList",
      params: {
        QrCode: scanResult,
      },
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
    });
    if (getItemListResponse.data) {
      // console.log(getItemListResponse.data);

      const withTrimmedCurrency = {
        ...getItemListResponse.data,
        Currency: getItemListResponse.data.Currency.trim(),
      };
      dispatch(setQrItem(withTrimmedCurrency));
      dispatch(setBasketLocation(getItemListResponse.data.LocationName));
      if (getItemListResponse.data.hasOwnProperty("OperatorStatus")) {
        if (typeof getItemListResponse.data.OperatorStatus === "string") {
          dispatch(setProdStatus(getItemListResponse.data.OperatorStatus));
        }
      }
    } else {
      dispatch(setGetItemError(404));
      dispatch(setQrItem(null));
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      dispatch(setGetItemError(error.response.status));
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      dispatch(setGetItemError(500));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      dispatch(setGetItemError(500));
    }
  } finally {
    // setTimeout(() => dispatch(setScanDelay(defaultScanDelay)), 2500);
    dispatch(setGetItemLoading(false));
    dispatch(setScanError(null));
    dispatch(setIsScanSuccess(false));
  }
};

export const getLocationByQR = () => async (dispatch, getState) => {
  const { scanResult } = getState().ScannerReducer;
  try {
    let res = await axiosInstance({
      method: "get",
      url: "/API/GetLocationByQR",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        QrCode: String(scanResult).substring(0, 13)
      },
    });

    if (res.data) dispatch(setQrLocation(res.data));
    else dispatch(setQrLocation(null));
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
    dispatch(setQrLocation(null));
    return;
  }
};

//
//
export const setQty = (qty) => ({
  type: SET_QTY,
  payload: qty,
});

export const setIsInputEmpty = (isInputEmpty) => ({
  type: SET_IS_INPUT_EMPTY,
  payload: isInputEmpty,
});

export const onInputChange = (eTargetValue, setValue = false) => (
  dispatch,
  getState
) => {
  const { qty } = getState().ScannerReducer;

  const intInput = parseInt(eTargetValue);

  if (isNaN(intInput) || (setValue && intInput < 0)) {
    dispatch(setQty(0));
    dispatch(setIsInputEmpty(true));
    return;
  } else {
    dispatch(setIsInputEmpty(false));
  }

  if (setValue) {
    dispatch(setQty(intInput));
  } else {
    let newAmount = qty + intInput;
    dispatch(setQty(newAmount));
    if (newAmount === 0) {
      dispatch(setIsInputEmpty(false));
    }
  }
};

//
//

export const setGetItemLikesStatus = (getItemLikesStatus) => ({
  type: GET_ITEM_LIKES_STATUS,
  payload: getItemLikesStatus,
});

export const setItemLikes = (itemLikes) => ({
  type: SET_ITEM_LIKES,
  payload: itemLikes,
});

export const getItemLikesAction = () => async (dispatch, getState) => {
  dispatch(setGetItemLikesStatus(status.loading));

  try {
    const getItemLikesRes = await axiosInstance({
      method: "get",
      url: "/api/Likes",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        ItemListid: getState().ScannerReducer.qrItem.ItemListId,
      },
    });

    if (getItemLikesRes.data) {
      const likesRes = {
        Likes: getItemLikesRes.data.Likes ?? 0,
        DisLikes: getItemLikesRes.data.DisLikes ?? 0,
        Indifferent: getItemLikesRes.data.Indifferent ?? 0,
        Comment: getItemLikesRes.data.Comment ?? 0,
      };
      likesRes.total =
        likesRes.Likes + likesRes.DisLikes + likesRes.Indifferent;

      dispatch(setItemLikes(likesRes));

      dispatch(setGetItemLikesStatus(status.finish));
    } else {
      dispatch(setGetItemLikesStatus(`${status.error} 404`));
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

    dispatch(setGetItemLikesStatus(`${status.error} ${caughtError}`));
    return;
  }
};

export const setGetItemReviewsStatus = (getItemReviewsStatus) => ({
  type: GET_ITEM_REVIEWS_STATUS,
  payload: getItemReviewsStatus,
});

export const setItemReviews = (itemReviews) => ({
  type: SET_ITEM_REVIEWS,
  payload: itemReviews,
});

export const getItemReviewsAction = () => async (dispatch, getState) => {
  dispatch(setGetItemReviewsStatus(status.loading));

  const qrItem = getState().ScannerReducer.qrItem;
  if (!qrItem) {
    dispatch(setGetItemReviewsStatus(`${status.error} 404`));
    return;
  }

  try {
    const getItemReviewsRes = await axiosInstance({
      method: "get",
      url: "/api/ItemReviews",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        ItemListid: qrItem.ItemListId,
      },
    });

    if (getItemReviewsRes.data) {
      if (!Array.isArray(getItemReviewsRes.data)) {
        dispatch(setGetItemReviewsStatus(`${status.error} 404`));
      }

      dispatch(setItemReviews(getItemReviewsRes.data));
      dispatch(setGetItemReviewsStatus(status.finish));
    } else {
      dispatch(setGetItemReviewsStatus(`${status.error} 404`));
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

    dispatch(setGetItemReviewsStatus(`${status.error} ${caughtError}`));
    return;
  }
};
