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

import { axiosInstance, status } from "../../api/api";
import { getCurrencyFromIsoOrSymbol } from "../../Assets/currencies";

export const setPaymentStage = (paymentStage) => ({
  type: PAYMENT_STAGE,
  payload: paymentStage,
});

//
//

export const setPayWithCreditCard = (payWithCreditCard) => ({
  type: PAY_WITH_CREDIT_CARD,
  payload: payWithCreditCard,
});

export const setPayWithPrepaidCard = (payWithPrepaidCard) => ({
  type: PAY_WITH_PREPAID_CARD,
  payload: payWithPrepaidCard,
});

export const setPrepaidAmountUsd = (prepaidAmountUsd) => ({
  type: PREPAID_AMOUNT_USD,
  payload: prepaidAmountUsd,
});

//
//

export const setGetByeByeStatus = (byeByeStatus) => ({
  type: GET_BYE_BYE_STATUS,
  payload: byeByeStatus,
});

export const setByeBye = (byeBye) => ({
  type: SET_BYE_BYE,
  payload: byeBye,
});

export const getByeByeAction = () => async (dispatch, getState) => {
  dispatch(setGetByeByeStatus(status.loading));

  try {
    const getByeByeRes = await axiosInstance({
      method: "get",
      url: "/api/ByeBye",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        QRcode: getState().BasketReducer.basketDbData.QRLocation,
      },
    });

    if (getByeByeRes.data) {
      dispatch(setByeBye(getByeByeRes.data));
      dispatch(setGetByeByeStatus(status.finish));
    } else {
      dispatch(setGetByeByeStatus(`${status.error} 404`));
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

    dispatch(setGetByeByeStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setGetCardsStatus = (getCardsStatus) => ({
  type: GET_CARDS_STATUS,
  payload: getCardsStatus,
});

export const setCards = (cards) => ({
  type: SET_CARDS,
  payload: cards,
});

export const getCardsAction = () => async (dispatch, getState) => {
  dispatch(setGetCardsStatus(status.loading));

  try {
    const getCardsRes = await axiosInstance({
      method: "get",
      url: "/payments/SavedCard",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
    });

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      const modifiedCards = [...getCardsRes.data];
      modifiedCards.push({
        ...[modifiedCards],
        Last4digits: "1231",
      });
      modifiedCards.push({
        ...[modifiedCards],
        Last4digits: "1232",
      });
      modifiedCards.push({
        ...[modifiedCards],
        Last4digits: "1234",
      });
      modifiedCards.push({
        ...[modifiedCards],
        Last4digits: "1235",
      });

      dispatch(setCards(modifiedCards));
    } else {
      dispatch(setCards(getCardsRes.data));
    }
    if (getCardsRes.data.length === 0) {
      dispatch(setSelectedCard("9999"));
    }
    dispatch(setGetCardsStatus(status.finish));
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

    dispatch(setGetCardsStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setPayCardResponse = (payCardResponse) => ({
  type: SET_PAY_CARD_RESPONSE,
  payload: payCardResponse,
});

export const setPayCardStatus = (payCardStatus) => ({
  type: PAY_CARD_STATUS,
  payload: payCardStatus,
});

export const payCardAction = () => async (dispatch, getState) => {
  dispatch(setPayCardStatus(status.loading));

  //
  const Amount = getState().BasketReducer.totalPrice;

  //
  //live transaction
  const locationName = getState().BasketReducer.basketLocation || "";
  const locationCurrency = getCurrencyFromIsoOrSymbol(
    getState().BasketReducer.basketCurrency
  ).iso;
  const liveData = {
    TransferType: "Live",
    TransactionDetails: `Spinmor App at ${locationName}`,
    Currency: locationCurrency,
    Amount: Amount,
  };

  if (getState().PaymentReducer.selectedCard === "9999") {
    liveData.CardNumber = "";
    liveData.NameOnCard = "";
    liveData.Month = "";
    liveData.Year = "";
    liveData.CVC = "";
    liveData.SaveCardDetails = false;
  } else {
    liveData.PaymentProfileId = "";
    liveData.CustomerProfileId = "";
  }

  //
  //sandbox transaction
  const sandboxData = {
    CardNumber: "370000000000002",
    NameOnCard: `${getState().AppReducer.firstName} ${
      getState().AppReducer.lastName
    }`,
    TransferType: "Sandbox",
    Month: 4,
    Year: 22,
    CVC: "566",
    TransactionDetails: "Sandbox transaction",
    SaveCardDetails: true,
    PaymentProfileId: "",
    CustomerProfileId: "",
    Currency: "USD",
    Amount: Amount,
  };

  let data = {};
  if (getState().AppReducer.prodStatus === "Sandbox") {
    data = sandboxData;
  } else {
    data = liveData;
  }

  console.log(data);

  try {
    const payCardRes = await axiosInstance({
      method: "post",
      url: "/payments/PayCard",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data,
    });

    dispatch(setPayCardResponse(payCardRes.data));
    dispatch(setPayCardStatus(status.finish));
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

    dispatch(setPayCardStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setProcessedOrder = (processedOrder) => ({
  type: SET_PROCESSED_ORDER,
  payload: processedOrder,
});

export const setProcessOrderStatus = (processOrderStatus) => ({
  type: PROCESS_ORDER_STATUS,
  payload: processOrderStatus,
});

export const processOrderAction = () => async (dispatch, getState) => {
  dispatch(setProcessOrderStatus(status.loading));

  try {
    const processOrderRes = await axiosInstance({
      method: "post",
      url: "/api/ProcessOrder",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: {
        BasketID: getState().BasketReducer.basketId,
        TransactionID: getState().PaymentReducer.payCardResponse.Transactionid,
        CreditCard: 17.0,
        USDPrepaid: 0.0,
      },
    });

    dispatch(setProcessedOrder(processOrderRes.data.OrderId));
    dispatch(setProcessOrderStatus(status.finish));
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

    dispatch(setProcessOrderStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setSelectedCard = (selectedCard) => ({
  type: SELECTED_CARD,
  payload: selectedCard,
});

//

export const setNewCardForm = (fieldName, value) => ({
  type: SET_NEW_CARD_FORM,
  payload: {
    fieldName,
    value,
  },
});

//
//

export const setSignature = (signature) => ({
  type: SET_SIGNATURE,
  payload: signature,
});

export const setBasketConfirmationStatus = (basketConfirmationStatus) => ({
  type: BASKET_CONFIRMATION_STATUS,
  payload: basketConfirmationStatus,
});

export const basketConfirmationAction = () => async (dispatch, getState) => {
  dispatch(setBasketConfirmationStatus(status.loading));

  const newLineChar = "\n";

  const confirmToken = getState().PaymentReducer.signature;
  const locationName = getState().BasketReducer.basketLocation || "";
  const basketItems = getState().BasketReducer.basketItems;

  let message = `Your purchase at: '${locationName}'`;
  message += newLineChar;

  for (let i = 0; i < basketItems.length; i++) {
    message += `${basketItems[i].ItemName} - ${basketItems[i].Quantity}`;
    message += newLineChar;
  }

  message += newLineChar;
  message += `Digitally confirmed: ${confirmToken}`;

  try {
    await axiosInstance({
      method: "post",
      url: "/api/BasketConfirmation",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      data: {
        BasketID: getState().BasketReducer.basketId,
        SMSConfirm: confirmToken,
        SMSMessage: message,
      },
    });

    dispatch(setBasketConfirmationStatus(status.finish));
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

    dispatch(setBasketConfirmationStatus(`${status.error} ${caughtError}`));
    return;
  }
};

//
//

export const setSendOrderEmailStatus = (sendOrderEmailStatus) => ({
  type: SEND_ORDER_EMAIL_STATUS,
  payload: sendOrderEmailStatus,
});

export const sendOrderEmailAction = () => async (dispatch, getState) => {
  dispatch(setSendOrderEmailStatus(status.loading));

  try {
    await axiosInstance({
      method: "post",
      url: "/api/SendOrderEmail",
      headers: {
        Authorization: "Bearer " + getState().AppReducer.token,
      },
      withCredentials: true,
      params: {
        orderId: getState().PaymentReducer.processedOrder,
      },
    });

    dispatch(setSendOrderEmailStatus(status.finish));
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

    dispatch(setSendOrderEmailStatus(`${status.error} ${caughtError}`));
    return;
  }
};
