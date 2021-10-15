import React from "react";
// import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { status } from "../../api/api";
import {
  setPaymentStage,
  setSignature,
} from "../../Redux/PaymentReducer/Payment.act";
import {
  getBasketItemsAction,
  setGetBasketItemsStatus,
} from "../../Redux/BasketReducer/Basket.act";

const useStyles = makeStyles((theme) => ({
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },
  instructions: {
    marginTop: theme.spacing(4),
    // marginBottom: theme.spacing(4),
  },
  signatureStyle: {
    fontFamily: "Lucida Handwriting",
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer, PaymentReducer }) => ({
  firstName: AppReducer.firstName,

  paymentStage: PaymentReducer.paymentStage,

  basketItems: BasketReducer.basketItems,
  getBasketItemsStatus: BasketReducer.getBasketItemsStatus,

  signature: PaymentReducer.signature,
});
const mapDispatchToProps = (dispatch) => ({
  setPaymentStage: bindActionCreators(setPaymentStage, dispatch),

  setSignature: bindActionCreators(setSignature, dispatch),

  getBasketItemsAction: bindActionCreators(getBasketItemsAction, dispatch),
  setGetBasketItemsStatus: bindActionCreators(
    setGetBasketItemsStatus,
    dispatch
  ),
});

function ConfirmPayment({
  firstName,

  paymentStage,
  setPaymentStage,

  basketItems,
  getBasketItemsAction,
  getBasketItemsStatus,
  setGetBasketItemsStatus,

  signature,
  setSignature,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetBasketItemsStatus(status.not_started);
      //important not to clear the basket!
    };
  }, [setGetBasketItemsStatus]);

  //
  //get basket items
  React.useEffect(() => {
    if (getBasketItemsStatus === status.not_started) {
      getBasketItemsAction();
    }
  }, [getBasketItemsAction, getBasketItemsStatus]);

  //
  //
  const onContinue = () => {
    setPaymentStage(paymentStage + 1);
  };
  const onBack = () => {
    setPaymentStage(paymentStage - 1);
  };

  return (
    <React.Fragment>
      <Grid item className={clsx(classes.minMaxWidth, classes.instructions)}>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <Table aria-label="confirm items table">
            <TableHead>
              <TableRow>
                <TableCell align="left" scope="col">
                  Item
                </TableCell>
                <TableCell align="right" scope="col">
                  Quantity
                </TableCell>
              </TableRow>

              {getBasketItemsStatus === status.loading && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <LinearProgress color="primary" />
                  </TableCell>
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {basketItems.map((item) => (
                <TableRow key={item.ItemListId}>
                  <TableCell align="left">{item.ItemName}</TableCell>

                  <TableCell align="right">{item.Quantity}</TableCell>
                </TableRow>
              ))}

              {basketItems.length === 0 &&
                getBasketItemsStatus === status.finish && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <b>Your basket is empty</b>
                    </TableCell>
                  </TableRow>
                )}

              {getBasketItemsStatus.split(" ")[0] === status.error && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <b>
                      An occurred getting your basket:{" "}
                      {getBasketItemsStatus.split(" ")[1]}, please refresh the
                      page
                    </b>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item className={clsx(classes.minMaxWidth, classes.instructions)}>
        <Typography variant="h6" component="p">
          {firstName};
          <br />
          Your peace of mind is important to us.
          <br />
          Digitally confirm the above {basketItems.length} items and quantities
          you are available on display.
          <br />
          Once payment process is completed, you will receive SMS with your
          confirmation, followed by order and payment confirmation Email.
        </Typography>
      </Grid>

      <Grid item className={clsx(classes.minMaxWidth, classes.instructions)}>
        <TextField
          label="Your name"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          InputProps={{
            classes: {
              input: classes.signatureStyle,
            },
          }}
        />
      </Grid>

      <Grid
        container
        item
        className={clsx(classes.minMaxWidth, classes.instructions)}
      >
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onBack}
        >
          Back
        </Button>

        <div style={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onContinue}
          disabled={!signature || getBasketItemsStatus !== status.finish}
        >
          {!signature || getBasketItemsStatus !== status.finish
            ? "Sign to continue"
            : "Choose Payment Method"}
        </Button>
      </Grid>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPayment);
