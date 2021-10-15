import querystring from "query-string";

import {
  SET_IS_MENU_OPEN,
  //
  RISK_TMP_LOGIN_INFO,
  //
  SET_IS_TOKEN_CALL_LOADING,
  SET_TOKEN_CALL_ERROR,
  SET_TOKEN,
  LOGOUT,
  //
  SET_IS_LOGIN_LOADING,
  SET_LOGIN_ERROR,
  //
  SET_NAME,
  SET_CURRENCY,
  //
  SET_PROD_STATUS,
  //
  SUPPORT_STATUS,
  //
  SET_INITIALIZATION_STATUS,
} from "./App.types";

import { axiosInstance, status } from "../../api/api";
import { getCurrencyFromIsoOrSymbol } from "../../Assets/currencies";
import {
  setBasketDbData,
  setBasketLocation,
} from "../BasketReducer/Basket.act";

export const setIsMenuOpen = (isMenuOpen) => ({
  type: SET_IS_MENU_OPEN,
  payload: isMenuOpen,
});

export const riskTmpLoginInfo = (loginInfo) => ({
  type: RISK_TMP_LOGIN_INFO,
  payload: loginInfo,
});

export const setIsTokenCallLoading = (isTokenCallLoading) => ({
  type: SET_IS_TOKEN_CALL_LOADING,
  payload: isTokenCallLoading,
});

export const setTokenCallError = (tokenCallError) => ({
  type: SET_TOKEN_CALL_ERROR,
  payload: tokenCallError,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

// export const logout = () => {
//   localStorage.removeItem("@token");
//   localStorage.removeItem("@loginCookieInfo");
//   localStorage.setItem("@initializationStatus");
//   // localStorage.removeItem("@risk_login");

//   return {
//     type: LOGOUT,
//   };
// };
export const logout = () => async (dispatch, getState) => {
  localStorage.removeItem("@token");
  localStorage.removeItem("@loginCookieInfo");
  localStorage.setItem(
    "@initializationStatus",
    getState().AppReducer.initializationStatus
  );

  dispatch({
    type: LOGOUT,
  });
};

export const tokenAction = (email, password) => async (dispatch, getState) => {
  localStorage.removeItem("@initializationStatus");
  dispatch(setIsTokenCallLoading(true));

  try {
    const requestTime = Date.now();
    const tokenResponse = await axiosInstance({
      method: "post",
      url: "/Token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: querystring.stringify({
        grant_type: "password",
        username: email,
        password: password,
        ipaddress: "",
      }),
      withCredentials: true,
    });

    if (tokenResponse.data) {
      // const riskLoginInfo = {
      //   UserName: email,
      //   Password: password,
      // };
      // dispatch(riskTmpLoginInfo(riskLoginInfo));
      // localStorage.setItem("@risk_login", JSON.stringify(riskLoginInfo));

      dispatch(setToken(tokenResponse.data.access_token));
      localStorage.setItem("@token", tokenResponse.data.access_token);

      const responseTime = Date.now();
      const expireTime =
        responseTime +
        (tokenResponse.data?.expires_in ?? 86399) * 1000 -
        60 * 1000; //response time + expires_in - 1 minute
      localStorage.setItem(
        "@loginCookieInfo",
        JSON.stringify({
          requestTime,
          responseTime,
          expireTime,
        })
      );
    } else {
      dispatch(setTokenCallError(404));
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      dispatch(setTokenCallError(error.response.status));
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      dispatch(setTokenCallError(500));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      dispatch(setTokenCallError(500));
    }
  } finally {
    dispatch(setIsTokenCallLoading(false));
  }
};

//
//

export const setProdStatus = (prodStatus) => ({
  type: SET_PROD_STATUS,
  payload: prodStatus?.trim?.() || "Sandbox",
});

export const setIsLoginLoading = (isLoginLoading) => ({
  type: SET_IS_LOGIN_LOADING,
  payload: isLoginLoading,
});

export const setLoginError = (loginError) => ({
  type: SET_LOGIN_ERROR,
  payload: loginError,
});

//
//

export const setName = (firstName, lastName) => ({
  type: SET_NAME,
  payload: {
    firstName,
    lastName,
  },
});

export const setCurrency = (newCurrency) => ({
  type: SET_CURRENCY,
  payload: newCurrency,
});

//
//

export const loginAction = () => async (dispatch, getState) => {
  const initializationStatus = getState().AppReducer.initializationStatus;

  if (initializationStatus !== status.finish) {
    dispatch(setIsLoginLoading(true));
  }

  try {
    const loginResponse = await axiosInstance({
      method: "post",
      url: "/api/login",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      // data: {
      //   UserName: "ran@test.com",
      //   Password: "ran",
      // },
      // data: getState().AppReducer.loginInfo,
      withCredentials: true,
    });

    if (loginResponse.data) {
      const loginData = loginResponse.data;

      dispatch(setProdStatus(loginData.OperatorStatus));
      dispatch(setName(loginData.FirstName, loginData.LastName));
      dispatch(setBasketDbData(loginData));
      dispatch(
        setCurrency(getCurrencyFromIsoOrSymbol(loginData.CurrencySymbol))
      );
      if (loginData.LocationName) {
        dispatch(setBasketLocation(loginData.LocationName));
      }

      const currentLoginError = getState().AppReducer.loginError;
      if (currentLoginError) {
        dispatch(setLoginError(null));
      }

      if (initializationStatus !== status.finish) {
        dispatch(setInitializationStatus(status.success_login));
      }
    } else {
      dispatch(setLoginError(404));
      if (initializationStatus !== status.finish) {
        dispatch(setInitializationStatus(status.error_login));
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

    dispatch(setLoginError(caughtError));

    if (initializationStatus !== status.finish) {
      dispatch(setInitializationStatus(status.error_login));
    }
  } finally {
    if (initializationStatus !== status.finish) {
      dispatch(setIsLoginLoading(false));
    }
  }
};

//
//

export const setInitializationStatus = (initializationStatus) => ({
  type: SET_INITIALIZATION_STATUS,
  payload: initializationStatus,
});

//
//

export const setSupportStatus = (supportStatus) => ({
  type: SUPPORT_STATUS,
  payload: supportStatus,
});

export const supportAction = (support) => async (dispatch, getState) => {
  dispatch(setSupportStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/host/support",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: {
        Support: support,
      },
    });

    dispatch(setSupportStatus(status.finish));
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

    dispatch(setSupportStatus(`${status.error} ${caughtError}`));
    return;
  }
};
