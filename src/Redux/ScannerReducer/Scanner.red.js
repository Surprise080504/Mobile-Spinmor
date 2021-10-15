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
import { status } from "../../api/api";

const initialState = {
  scannerReadyOnce: false,
  delay: defaultScanDelay,
  isScanSuccess: false,
  // scanResult: "no result",
  scanResult: null,
  scanError: null,
  //
  getItemLoading: false,
  getItemError: null,
  qrItem: null,
  //
  qty: 1,
  isInputEmpty: false,

  getItemLikesStatus: status.not_started,
  itemLikes: {
    total: 0,
    Likes: 0,
    DisLikes: 0,
    Indifferent: 0,
    Comment: 0,
  },

  getItemReviewsStatus: status.not_started,
  itemReviews: [],
};

const ScannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SCANNER_READY_ONCE: {
      return {
        ...state,
        scannerReadyOnce: action.payload,
      };
    }

    case SET_SCAN_DELAY: {
      return {
        ...state,
        delay: action.payload,
      };
    }

    case SET_IS_SCAN_SUCCESS: {
      return {
        ...state,
        isScanSuccess: action.payload,
      };
    }

    case SET_SCAN_RESULT: {
      return {
        ...state,
        scanResult: action.payload,
      };
    }

    case SET_SCAN_ERROR: {
      return {
        ...state,
        scanError: action.payload,
      };
    }

    //
    //

    case GET_ITEM_LOADING: {
      console.log(action.payload);
      console.log(typeof action.payload);
      return {
        ...state,
        getItemLoading: action.payload,
      };
    }

    case GET_ITEM_ERROR: {
      return {
        ...state,
        getItemError: action.payload,
      };
    }

    case SET_QR_ITEM: {
      return {
        ...state,
        qrItem: action.payload,
      };
    }

    //
    //

    case SET_QTY: {
      return {
        ...state,
        qty: action.payload,
      };
    }

    case SET_IS_INPUT_EMPTY: {
      return {
        ...state,
        isInputEmpty: action.payload,
      };
    }

    //
    //

    case GET_ITEM_LIKES_STATUS: {
      return {
        ...state,
        getItemLikesStatus: action.payload,
      };
    }

    case SET_ITEM_LIKES: {
      return {
        ...state,
        itemLikes: action.payload,
      };
    }

    case GET_ITEM_REVIEWS_STATUS: {
      return {
        ...state,
        getItemReviewsStatus: action.payload,
      };
    }

    case SET_ITEM_REVIEWS: {
      return {
        ...state,
        itemReviews: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default ScannerReducer;
