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

import { status } from "../../api/api";
import { currencies } from "../../Assets/currencies";
import { operatorAppTitle, operatorAppHost } from "../../Assets/consts";

const initialState = {
  isMenuOpen: false,
  themeType: "light",
  direction: "ltr",

  token: getToken(),
  isTokenCallLoading: false,
  tokenCallError: null,

  initializationStatus: status.not_started,
  // initializationStatus:
  //   localStorage.getItem("@initializationStatus") ?? status.not_started,

  isLoginLoading: true, //not used - 26.01.21
  loginError: null, //not used - 26.01.21

  firstName: null,
  lastName: null,

  currency: { ...currencies[0] },

  // loginInfo: riskGetLoginInfo(),
  operatorAppTitle:
    new URLSearchParams(window.location.search).get("operatorAppTitle") ??
    operatorAppTitle,
  operatorAppHost:
    new URLSearchParams(window.location.search).get("operatorAppHost") ??
    operatorAppHost,

  prodStatus: null,

  supportStatus: status.not_started,
};

// function riskGetLoginInfo() {
//   const stringifiedRiskLoginInfo = localStorage.getItem("@risk_login");
//   if (stringifiedRiskLoginInfo) {
//     return JSON.parse(stringifiedRiskLoginInfo);
//   } else {
//     return {
//       UserName: null,
//       Password: null,
//     };
//   }
// }

function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryParamToken = urlParams.get("token");
  if (queryParamToken) {
    return queryParamToken;
  }

  const stringifiedLoginCookieInfo = localStorage.getItem("@loginCookieInfo");
  if (stringifiedLoginCookieInfo) {
    const loginCookieInfo = JSON.parse(stringifiedLoginCookieInfo);

    if (Date.now() > loginCookieInfo.expireTime) {
      return null;
    } else {
      return localStorage.getItem("@token") || null; //need to add a different flag, maybe true or false to mark if token is valid
    }
  } else {
    return null;
  }
}

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_MENU_OPEN: {
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    }

    case RISK_TMP_LOGIN_INFO: {
      return {
        ...state,
        loginInfo: action.payload,
      };
    }

    //
    //

    case SET_IS_TOKEN_CALL_LOADING: {
      return {
        ...state,
        isTokenCallLoading: action.payload,
      };
    }

    case SET_TOKEN_CALL_ERROR: {
      return {
        ...state,
        tokenCallError: action.payload,
      };
    }

    case SET_TOKEN: {
      return {
        ...state,
        token: action.payload,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        token: null,
        initializationStatus: status.not_started,
        isLoginLoading: true,
        loginError: null,
      };
    }

    //
    //

    case SET_IS_LOGIN_LOADING: {
      return {
        ...state,
        isLoginLoading: action.payload,
      };
    }

    case SET_LOGIN_ERROR: {
      return {
        ...state,
        loginError: action.payload,
      };
    }

    //
    //

    case SET_CURRENCY: {
      return {
        ...state,
        currency: action.payload,
      };
    }

    case SET_NAME: {
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
    }

    //
    //

    case SET_INITIALIZATION_STATUS: {
      return {
        ...state,
        initializationStatus: action.payload,
      };
    }

    //
    //

    case SET_PROD_STATUS: {
      return {
        ...state,
        prodStatus: action.payload,
      };
    }

    //
    //

    case SUPPORT_STATUS: {
      return {
        ...state,
        supportStatus: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default AppReducer;
