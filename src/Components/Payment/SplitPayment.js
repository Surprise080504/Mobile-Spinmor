import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { evaluate } from "mathjs";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { exchangeFormat } from "../../Assets/currencies";
import { status } from "../../api/api";
import {
  setPaymentStage,
  setPayWithCreditCard,
  setPayWithPrepaidCard,
  setPrepaidAmountUsd,
} from "../../Redux/PaymentReducer/Payment.act";

const useStyles = makeStyles((theme) => ({
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },
  minMaxWidthPrice: {
    width: "100%",
    maxWidth: parseInt(theme.scannerWidth / 1.5),
    alignSelf: "flex-start",
  },
  instructions: {
    marginTop: theme.spacing(4),
    // marginBottom: theme.spacing(4),
  },
  chargeNote: {
    paddingTop: theme.spacing(1),
  },
  prepaidBalance: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },

  marginSpacing1: {
    marginTop: theme.spacing(1),
  },
  marginSpacing2: {
    marginTop: theme.spacing(2),
  },
  marginSpacing3: {
    marginTop: theme.spacing(3),
  },
  marginSpacing4: {
    marginTop: theme.spacing(4),
  },

  pricesColumn: {
    width: "auto",
  },
  alignInputText: {
    "& .MuiInputBase-input": {
      textAlign: "center",
      maxWidth: 75,
    },
    '& input[type="number"]': {
      "-moz-appearance": "textfield",
    },
    '& input[type="number"]::-webkit-clear-button, & input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
      display: "none !important",
      margin: 0,
      "-webkit-appearance": "none",
    },
  },

  continueItem: {
    marginTop: theme.spacing(6),
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer, PaymentReducer }) => ({
  creditBalance: BasketReducer.creditBalance,
  totalPrice: BasketReducer.totalPrice,

  currency: AppReducer.currency,
  exchangeRate: BasketReducer.exchangeRate,
  basketCurrency: BasketReducer.basketCurrency,

  paymentStage: PaymentReducer.paymentStage,

  payWithCreditCard: PaymentReducer.payWithCreditCard,
  payWithPrepaidCard: PaymentReducer.payWithPrepaidCard,
});
const mapDispatchToProps = (dispatch) => ({
  setPaymentStage: bindActionCreators(setPaymentStage, dispatch),

  setPayWithCreditCard: bindActionCreators(setPayWithCreditCard, dispatch),
  setPayWithPrepaidCard: bindActionCreators(setPayWithPrepaidCard, dispatch),
  setPrepaidAmountUsd: bindActionCreators(setPrepaidAmountUsd, dispatch),
});

function SplitPayment({
  creditBalance,
  totalPrice,

  currency,
  exchangeRate,
  basketCurrency,

  paymentStage,
  setPaymentStage,

  payWithCreditCard,
  payWithPrepaidCard,
  setPayWithCreditCard,
  setPayWithPrepaidCard,
  setPrepaidAmountUsd,
}) {
  const classes = useStyles();

  const [prepaidEdit, setPrepaidEdit] = React.useState("");
  const onPrepaidChange = (e) => {
    let inputVal = parseFloat(e.target.value);
    if (isNaN(inputVal)) {
      inputVal = 0;
    } else {
      const inputValInUsd = evaluate(
        `(${inputVal} / ${exchangeRate[currency.iso]}) * ${
          exchangeRate["USD"]
        } * ${1}`
      );
      if (inputValInUsd > creditBalance) {
        inputVal = evaluate(
          `(${creditBalance} / ${exchangeRate["USD"]}) * ${
            exchangeRate[currency.iso]
          } * ${1}`
        );
      }
    }

    setPrepaidEdit(inputVal);
  };

  //
  //this hook calculates the credit card amount according to user input of prepaid amount
  React.useEffect(() => {
    //total from basket currency to USD
    let totalInUsd = evaluate(
      `(${totalPrice} / ${exchangeRate[basketCurrency.trim()]}) * ${
        exchangeRate["USD"]
      } * ${1}`
    );

    //prepaidEdit from currency.iso to USD
    //  (prepaidEdit is always in user currency)
    const prepaidEditInUsd = evaluate(
      `(${prepaidEdit || 0} / ${exchangeRate[currency.iso]}) * ${
        exchangeRate["USD"]
      } * ${1}`
    );

    //the minimum in USD
    const minCreditInUsd = Math.min(
      prepaidEdit !== "" ? prepaidEditInUsd : creditBalance,
      totalInUsd
    );

    //credit card is is the complementary
    const creditCardInUsd = totalInUsd - minCreditInUsd;

    //that reminder to basket currency
    const creditCardInBasketCurrency = evaluate(
      `(${creditCardInUsd} / ${exchangeRate["USD"]}) * ${
        exchangeRate[basketCurrency.trim()]
      } * ${1}`
    );

    //minimum in user currency
    const minCreditInUserCurrency = parseFloat(
      evaluate(
        `(${minCreditInUsd} / ${exchangeRate["USD"]}) * ${
          exchangeRate[currency.iso]
        } * ${1}`
      ).toFixed(2)
    );

    setPayWithPrepaidCard(minCreditInUserCurrency);
    setPrepaidAmountUsd(minCreditInUsd);
    setPayWithCreditCard(creditCardInBasketCurrency);
  }, [
    prepaidEdit,
    payWithPrepaidCard,
    basketCurrency,
    creditBalance,
    exchangeRate,
    setPayWithCreditCard,
    setPayWithPrepaidCard,
    setPrepaidAmountUsd,
    totalPrice,
    currency,
  ]);

  const [adornments, setAdornments] = React.useState({ start: "", end: "" });
  React.useEffect(() => {
    let start = "";
    let end = "";

    if (currency.symbolPosition === "left") {
      start = currency.symbol;
      end = currency.iso;
    } else {
      start = currency.iso;
      end = currency.symbol;
    }

    setAdornments({ start, end });
  }, [currency]);

  //
  //
  const onContinue = () => {
    setPaymentStage(paymentStage + 1);
  };

  return (
    <React.Fragment>
      {/*<Grid item className={clsx(classes.minMaxWidth, classes.instructions)}>
        <Typography variant="h5">
          You can split the payment between prepaid card and credit card.
          <Typography variant="body1" className={classes.chargeNote}>
            We always charge in $USD.
          </Typography>
        </Typography>
      </Grid>*/}

      {/** prepaid card balance */}
      {/*<Grid
        item
        container
        className={clsx(classes.minMaxWidthPrice, classes.prepaidBalance)}
        direction="row"
        justify="space-between"
      >
        <Grid item>
          <Typography variant="body1" align="left">
            Your prepaid card balance:
          </Typography>
        </Grid>

        <Grid
          container
          item
          direction="column"
          className={classes.pricesColumn}
        >
          <Grid item>
            <Typography variant="body1" align="right">
              {exchangeFormat({
                localPrice: creditBalance,
                fromCurrency: "USD",
                toCurrency: currency.iso,
                exchangeRate,
                withIso: true,
                caller: "prepaid card balance user currency",
              })}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              {exchangeFormat({
                localPrice: creditBalance,
                fromCurrency: "USD",
                toCurrency: "USD",
                exchangeRate,
                withIso: true,
                caller: "prepaid card balance USD",
              })}
            </Typography>
          </Grid>
        </Grid>
      </Grid>*/}

      {/** pay with prepaid card */}
      <Grid
        item
        container
        className={clsx(classes.minMaxWidthPrice, classes.marginSpacing4)}
        direction="row"
        justify="space-between"
      >
        <Grid item>
          <Typography variant="body1" align="left">
            Pay with Prepaid Credit:
          </Typography>
        </Grid>

        <Grid
          container
          item
          direction="column"
          className={classes.pricesColumn}
        >
          <Grid item>
            {/*<TextField
              type="number"
              // value={exchangeFormat({
              //   localPrice: payWithPrepaidCard,
              //   fromCurrency: "USD",
              //   toCurrency: currency.iso,
              //   exchangeRate,
              //   withSymbol: false,
              //   caller: "pay with prepaid card user currency input",
              // })}
              value={payWithPrepaidCard}
              disabled={creditBalance === 0}
              onChange={onPrepaidChange}
              InputProps={{
                className: classes.alignInputText,
                startAdornment: (
                  <InputAdornment position="start">
                    {adornments.start}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {adornments.end}
                  </InputAdornment>
                ),
              }}
            />*/}
            <Typography variant="body1" align="right">
              {exchangeFormat({
                localPrice: payWithPrepaidCard,
                fromCurrency: currency.iso,
                toCurrency: currency.iso,
                exchangeRate,
                caller: "pay total user currency",
              })}
            </Typography>
          </Grid>

          {/*<Grid item>
            <Typography variant="body2" align="right">
              {exchangeFormat({
                localPrice: payWithPrepaidCard, //this is always in user currency
                fromCurrency: currency.iso,
                toCurrency: "USD",
                exchangeRate,
                withIso: true,
                caller: "pay with prepaid card USD",
              })}
            </Typography>
          </Grid>*/}
        </Grid>
      </Grid>

      {/** pay with credit card */}
      <Grid
        item
        container
        className={clsx(classes.minMaxWidthPrice, classes.marginSpacing1)}
        direction="row"
        justify="space-between"
      >
        <Grid item>
          <Typography variant="body1" align="left">
            Pay with Credit Card:
          </Typography>
        </Grid>

        <Grid
          container
          item
          direction="column"
          className={classes.pricesColumn}
        >
          <Grid item>
            <Typography variant="body1" align="right">
              {exchangeFormat({
                localPrice: payWithCreditCard,
                fromCurrency: basketCurrency,
                toCurrency: currency.iso,
                exchangeRate,
                caller: "pay with credit card user currency",
              })}
            </Typography>
          </Grid>
          {/*<Grid item>
            <Typography variant="body2" align="right">
              {exchangeFormat({
                localPrice: payWithCreditCard,
                fromCurrency: basketCurrency,
                toCurrency: "USD",
                exchangeRate,
                withIso: true,
                caller: "pay with credit card USD",
              })}
            </Typography>
          </Grid>*/}
        </Grid>
      </Grid>

      {/** total price */}
      <Grid
        item
        container
        className={clsx(classes.minMaxWidthPrice, classes.marginSpacing1)}
        direction="row"
        justify="space-between"
      >
        <Grid item>
          <Typography variant="body1" align="left">
            Total order:
          </Typography>
        </Grid>

        <Grid
          container
          item
          direction="column"
          className={classes.pricesColumn}
        >
          <Grid item>
            <Typography variant="body1" align="right">
              {exchangeFormat({
                localPrice: totalPrice,
                fromCurrency: basketCurrency,
                toCurrency: currency.iso,
                exchangeRate,
                caller: "pay total user currency",
              })}
            </Typography>
          </Grid>
          {/*<Grid item>
            <Typography variant="body2" align="right">
              {exchangeFormat({
                localPrice: totalPrice,
                fromCurrency: basketCurrency,
                toCurrency: "USD",
                exchangeRate,
                withIso: true,
                caller: "pay total USD",
              })}
            </Typography>
          </Grid>*/}
        </Grid>
      </Grid>

      <Grid item className={classes.continueItem}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onContinue}
        >
          Continue
        </Button>
      </Grid>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SplitPayment);
