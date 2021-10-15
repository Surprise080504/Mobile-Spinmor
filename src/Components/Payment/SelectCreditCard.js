import React from "react";
// import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";

import AddCreditCard from "./AddCreditCard";
import { exchangeFormat } from "../../Assets/currencies";
import { status } from "../../api/api";
import {
  setPaymentStage,
  setGetCardsStatus,
  getCardsAction,
  setSelectedCard,
  payCardAction,
  processOrderAction,
  basketConfirmationAction,
  sendOrderEmailAction,
} from "../../Redux/PaymentReducer/Payment.act";

const useStyles = makeStyles((theme) => ({
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },
  instructions: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },

  cardItem: {
    marginBottom: theme.spacing(2),
    minWidth: 280,
    maxWidth: 450,
    padding: theme.spacing(1),
    flexWrap: "nowrap",
  },
  radioContainer: {
    marginRight: theme.spacing(1),
  },
  actionContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 280,
    maxWidth: 450,
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer, PaymentReducer }) => ({
  currency: AppReducer.currency,
  basketCurrency: BasketReducer.basketCurrency,

  paymentStage: PaymentReducer.paymentStage,

  getCardsStatus: PaymentReducer.getCardsStatus,
  cards: PaymentReducer.cards,

  selectedCard: PaymentReducer.selectedCard,

  payCardStatus: PaymentReducer.payCardStatus,
  processOrderStatus: PaymentReducer.processOrderStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setPaymentStage: bindActionCreators(setPaymentStage, dispatch),

  setGetCardsStatus: bindActionCreators(setGetCardsStatus, dispatch),
  getCardsAction: bindActionCreators(getCardsAction, dispatch),

  setSelectedCard: bindActionCreators(setSelectedCard, dispatch),

  payCardAction: bindActionCreators(payCardAction, dispatch),
  processOrderAction: bindActionCreators(processOrderAction, dispatch),

  basketConfirmationAction: bindActionCreators(
    basketConfirmationAction,
    dispatch
  ),
  sendOrderEmailAction: bindActionCreators(sendOrderEmailAction, dispatch),
});

function SelectCreditCard({
  currency,
  basketCurrency,

  paymentStage,
  setPaymentStage,

  setGetCardsStatus,
  getCardsAction,
  getCardsStatus,
  cards,

  setSelectedCard,
  selectedCard,

  payCardStatus,
  processOrderStatus,

  payCardAction,
  processOrderAction,

  basketConfirmationAction,
  sendOrderEmailAction,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    setGetCardsStatus(status.not_started);
  }, [setGetCardsStatus]);

  //
  //
  React.useEffect(() => {
    if (getCardsStatus === status.not_started) {
      getCardsAction();
    }
  }, [getCardsAction, getCardsStatus]);

  //
  //
  const onSelectCard = (Last4digits) => {
    setSelectedCard(Last4digits);
  };

  //
  //
  const onCharge = () => {
    payCardAction();
  };
  React.useEffect(() => {
    if (payCardStatus === status.finish) {
      processOrderAction();
    }
  }, [payCardStatus, processOrderAction]);

  //
  //send SMS & email confirmation (no indication about status of the calls) + go to next step
  React.useEffect(() => {
    if (processOrderStatus === status.finish) {
      basketConfirmationAction();
      sendOrderEmailAction();
      setPaymentStage(paymentStage + 1);
    }
  }, [
    basketConfirmationAction,
    paymentStage,
    processOrderStatus,
    sendOrderEmailAction,
    setPaymentStage,
  ]);

  //
  //
  const onBack = () => {
    setPaymentStage(paymentStage - 1);
  };

  return (
    <React.Fragment>
      <Grid item className={clsx(classes.minMaxWidth, classes.instructions)}>
        <Typography variant="h5">
          Please select a credit card or add a new one
        </Typography>
      </Grid>

      {cards.map((card, index) => (
        <Grid
          key={index}
          container
          item
          component={Card}
          className={classes.cardItem}
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item className={classes.radioContainer}>
            <Radio
              value={card.Last4digits}
              inputProps={{ "aria-label": `card ${card.Last4digits}` }}
              checked={selectedCard === card.Last4digits}
              onChange={() => onSelectCard(card.Last4digits)}
              color="primary"
            />
          </Grid>

          <Grid container item direction="column" alignItems="flex-start">
            <Grid item>
              <Typography variant="body1">
                <b>{card.Last4digits}</b>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">{card.NameOnCard}</Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}

      <Grid
        container
        item
        component={Card}
        className={classes.cardItem}
        direction="column"
      >
        <Grid
          container
          item
          direction="row"
          justify="space-between"
          alignItems="center"
          style={{ flexWrap: "nowrap" }}
        >
          <Grid item className={classes.radioContainer}>
            <Radio
              value="9999"
              inputProps={{ "aria-label": "add new credit card" }}
              checked={selectedCard === "9999"}
              onChange={() => onSelectCard("9999")}
              color="primary"
              icon={<AddCircleOutlineIcon />}
              checkedIcon={<RadioButtonCheckedIcon />}
            />
          </Grid>

          <Grid container item direction="column" alignItems="flex-start">
            <Grid item>
              <Typography variant="body1">Add new credit card</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Collapse in={selectedCard === "9999"} timeout="auto">
          <AddCreditCard />
        </Collapse>
      </Grid>

      <Grid
        container
        item
        justify="space-between"
        className={classes.actionContainer}
      >
        <Grid item>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={onBack}
            disabled={
              payCardStatus === status.loading ||
              processOrderStatus === status.loading
            }
          >
            Back
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={onCharge}
            disabled={
              selectedCard === -1 ||
              payCardStatus === status.loading ||
              processOrderStatus === status.loading
            }
            endIcon={
              (payCardStatus === status.loading ||
                processOrderStatus === status.loading) && (
                <CircularProgress size="0.875rem" />
              )
            }
          >
            Charge
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCreditCard);
