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

import { status } from "../../api/api";
import { getCurrencyFromIsoOrSymbol } from "../../Assets/currencies";

const initialState = {
  creditBalance: 0,

  basketId: 0,
  basketCurrency: "AUD",
  basketLocation: "",
  basketItems: [],
  totalQty: 0.0,
  totalPrice: 0.0,
  totalTax: 0.0,

  addToBasketStatus: status.not_started,
  createBasketStatus: status.not_started,
  getBasketItemsStatus: status.not_started,

  isExchangeRateLoading: true, //not in use 26.01
  exchangeRateError: null, //not in use 26.01
  exchangeRate: {
    AUD: 1.568155,
    CAD: 1.53926,
    EUR: 1,
    GBP: 0.88895,
    USD: 1.20795,
  },

  basketDbData: {
    basketStatus: null,
    basketTotalAmount: 0.0,
    basketCurrencySymbol: null,
    creditBalance: 0.0,
    QRLocation: null,
  },

  calculatedTax: 0.0,
  calculatedTotalAmount: 0.0,

  editedBasketItem: {
    qr: "",
    ItemListId: -1,
    qty: 0,
    ItemName: "",
  },

  deleteBasketStatus: status.not_started,
};

const BasketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_EXCHANGE_RATE_LOADING: {
      return {
        ...state,
        isExchangeRateLoading: action.payload,
      };
    }

    case SET_EXCHANGE_RATE_ERROR: {
      return {
        ...state,
        exchangeRateError: action.payload,
      };
    }

    case SET_EXCHANGE_RATES: {
      return {
        ...state,
        exchangeRate: action.payload,
      };
    }

    //
    //

    case SET_BASKET_DB_DATA: {
      return {
        ...state,
        basketDbData: {
          basketStatus: action.payload.BasketStatus,
          basketTotalAmount: action.payload.BasketTotalAmount,
          basketCurrencySymbol: action.payload.BasketCurrencySymbol,
          creditBalance: action.payload.CreditBalance,
          QRLocation: action.payload.QRLocation || null,
        },
        creditBalance: action.payload.CreditBalance,
        basketCurrency:
          getCurrencyFromIsoOrSymbol(action.payload.BasketCurrencySymbol, {
            returnNull: true,
          })?.iso ??
          getCurrencyFromIsoOrSymbol(action.payload.CurrencySymbol, {
            returnNull: true,
          })?.iso ??
          "AUD",
        totalPrice: action.payload.BasketTotalAmount,
      };
    }

    //
    //

    case SET_BASKET_ID: {
      return {
        ...state,
        basketId: action.payload,
      };
    }

    case SET_BASKET_CURRENCY: {
      return {
        ...state,
        basketCurrency: action.payload,
      };
    }

    case SET_BASKET_LOCATION: {
      return {
        ...state,
        basketLocation: action.payload,
      };
    }

    //
    //

    case ADD_TO_BASKET_STATUS: {
      return {
        ...state,
        addToBasketStatus: action.payload,
      };
    }

    case CREATE_BASKET_STATUS: {
      return {
        ...state,
        createBasketStatus: action.payload,
      };
    }

    case ADD_ITEM_TO_BASKET: {
      return {
        ...state,
        // basketItems: action.payload.basketItems,
        // totalQty: action.payload.totalQty,
        totalPrice: action.payload.totalPrice,
        totalTax: action.payload.totalTax,
      };
    }

    //
    //

    case GET_BASKET_ITEMS_STATUS: {
      return {
        ...state,
        getBasketItemsStatus: action.payload,
      };
    }

    case SET_BASKET_ITEMS: {
      return {
        ...state,
        basketItems: action.payload,
      };
    }

    case CALC_BASKET_TAX: {
      return {
        ...state,
        calculatedTax: action.payload,
      };
    }

    case CALC_BASKET_TOTAL: {
      return {
        ...state,
        calculatedTotalAmount: action.payload,
      };
    }

    case EDIT_BASKET_ITEM: {
      return {
        ...state,
        editedBasketItem: action.payload,
      };
    }

    case DELETE_BASKET_STATUS: {
      return {
        ...state,
        deleteBasketStatus: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default BasketReducer;
