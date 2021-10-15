import {
  PAYMENT_STAGE,
  //
  PAY_WITH_CREDIT_CARD,
  PAY_WITH_PREPAID_CARD,
  PREPAID_AMOUNT_USD,
  //
  GET_BYE_BYE_STATUS,
  SET_BYE_BYE,
  //
  GET_CARDS_STATUS,
  SET_CARDS,
  //
  SET_PAY_CARD_RESPONSE,
  PAY_CARD_STATUS,
  //
  SET_PROCESSED_ORDER,
  PROCESS_ORDER_STATUS,
  //
  SELECTED_CARD,
  //
  SET_NEW_CARD_FORM,
  //
  SET_SIGNATURE,
  BASKET_CONFIRMATION_STATUS,
  //
  SEND_ORDER_EMAIL_STATUS,
} from "./Payment.types";

import { status } from "../../api/api";

const initialState = {
  paymentStage: 0,

  payWithCreditCard: -1,
  payWithPrepaidCard: -1,
  prepaidAmountUsd: -1,

  byeByeStatus: status.not_started,
  byeBye: null,

  getCardsStatus: status.not_started,
  cards: [],

  payCardStatus: status.not_started,
  payCardResponse: {
    Status: null,
    AuthorizationNumber: null,
    ResponseMessage: null,
    Transactionid: null,
  },

  processOrderStatus: status.not_started,
  processedOrder: null,

  selectedCard: -1,

  newCardForm: {
    CardNumber: "",
    NameOnCard: "",
    Month: "",
    Year: "",
    CVC: "",
    SaveCardDetails: false,
  },

  signature: "",
  basketConfirmationStatus: status.not_started,

  sendOrderEmailStatus: status.not_started,
};

const PaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_STAGE: {
      return {
        ...state,
        paymentStage: action.payload,
      };
    }

    //
    //

    case PAY_WITH_CREDIT_CARD: {
      return {
        ...state,
        payWithCreditCard: action.payload,
      };
    }

    case PAY_WITH_PREPAID_CARD: {
      return {
        ...state,
        payWithPrepaidCard: action.payload,
      };
    }

    case PREPAID_AMOUNT_USD: {
      return {
        ...state,
        prepaidAmountUsd: action.payload,
      };
    }

    //
    //

    case GET_BYE_BYE_STATUS: {
      return {
        ...state,
        byeByeStatus: action.payload,
      };
    }

    case SET_BYE_BYE: {
      return {
        ...state,
        byeBye: action.payload,
      };
    }

    //
    //

    case GET_CARDS_STATUS: {
      return {
        ...state,
        getCardsStatus: action.payload,
      };
    }

    case SET_CARDS: {
      return {
        ...state,
        cards: action.payload,
      };
    }

    //
    //

    case SET_PAY_CARD_RESPONSE: {
      return {
        ...state,
        payCardResponse: action.payload,
      };
    }

    case PAY_CARD_STATUS: {
      return {
        ...state,
        payCardStatus: action.payload,
      };
    }

    //
    //

    case SET_PROCESSED_ORDER: {
      return {
        ...state,
        processedOrder: action.payload,
      };
    }

    case PROCESS_ORDER_STATUS: {
      return {
        ...state,
        processOrderStatus: action.payload,
      };
    }

    //
    //

    case SELECTED_CARD: {
      return {
        ...state,
        selectedCard: action.payload,
      };
    }

    //
    //

    case SET_NEW_CARD_FORM: {
      const modifiedCardForm = { ...state.newCardForm };
      modifiedCardForm[action.payload.fieldName] = action.payload.value;

      return {
        ...state,
        newCardForm: modifiedCardForm,
      };
    }

    //
    //

    case SET_SIGNATURE: {
      return {
        ...state,
        signature: action.payload,
      };
    }

    case BASKET_CONFIRMATION_STATUS: {
      return {
        ...state,
        basketConfirmationStatus: action.payload,
      };
    }

    //
    //

    case SEND_ORDER_EMAIL_STATUS: {
      return {
        ...state,
        sendOrderEmailStatus: action.payload,
      };
    }

    //
    //

    default: {
      return state;
    }
  }
};

export default PaymentReducer;
