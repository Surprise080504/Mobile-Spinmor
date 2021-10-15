import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import {
  setPaymentStage,
  getByeByeAction,
  setGetByeByeStatus,
  setPayCardStatus,
  setProcessOrderStatus,
  setBasketConfirmationStatus,
  setSendOrderEmailStatus,
} from "../../Redux/PaymentReducer/Payment.act";
import {
  setSupportStatus,
  supportAction,
} from "../../Redux/AppReducer/App.act";
import { status } from "../../api/api";

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
    marginBottom: theme.spacing(4),
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

const mapStateToProps = ({ AppReducer, PaymentReducer }) => ({
  firstName: AppReducer.firstName,

  paymentStage: PaymentReducer.paymentStage,

  byeByeStatus: PaymentReducer.byeByeStatus,
  byeBye: PaymentReducer.byeBye,

  supportStatus: AppReducer.supportStatus,

  token: AppReducer.token,
  operatorAppTitle: AppReducer.operatorAppTitle,
  operatorAppHost: AppReducer.operatorAppHost,

  processedOrder: PaymentReducer.processedOrder,
});
const mapDispatchToProps = (dispatch) => ({
  setPaymentStage: bindActionCreators(setPaymentStage, dispatch),

  getByeByeAction: bindActionCreators(getByeByeAction, dispatch),
  setGetByeByeStatus: bindActionCreators(setGetByeByeStatus, dispatch),

  setSupportStatus: bindActionCreators(setSupportStatus, dispatch),
  supportAction: bindActionCreators(supportAction, dispatch),

  setPayCardStatus: bindActionCreators(setPayCardStatus, dispatch),
  setProcessOrderStatus: bindActionCreators(setProcessOrderStatus, dispatch),

  setBasketConfirmationStatus: bindActionCreators(
    setBasketConfirmationStatus,
    dispatch
  ),
  setSendOrderEmailStatus: bindActionCreators(
    setSendOrderEmailStatus,
    dispatch
  ),
});

function SandboxByeBye({
  firstName,

  paymentStage,
  setPaymentStage,

  getByeByeAction,
  setGetByeByeStatus,
  byeByeStatus,
  byeBye,

  supportStatus,
  setSupportStatus,
  supportAction,

  token,
  operatorAppTitle,
  operatorAppHost,

  processedOrder,

  setPayCardStatus,
  setProcessOrderStatus,
  setBasketConfirmationStatus,
  setSendOrderEmailStatus,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    return function cleanup() {
      setGetByeByeStatus(status.not_started);
      setSupportStatus(status.not_started);
      setPayCardStatus(status.not_started);
      setProcessOrderStatus(status.not_started);
      setBasketConfirmationStatus(status.not_started);
      setSendOrderEmailStatus(status.not_started);
      setPaymentStage(0);
    };
  }, [
    setBasketConfirmationStatus,
    setGetByeByeStatus,
    setPayCardStatus,
    setPaymentStage,
    setProcessOrderStatus,
    setSendOrderEmailStatus,
    setSupportStatus,
  ]);

  //
  //get bye bye message
  React.useEffect(() => {
    if (byeByeStatus === status.not_started) {
      getByeByeAction();
    }
  }, [byeByeStatus, getByeByeAction]);

  //
  //
  const [support, setSupport] = React.useState(null);
  const submitSupport = () => {
    supportAction(support);
  };

  return (
    <React.Fragment>
      <Grid item className={clsx(classes.minMaxWidth, classes.instructions)}>
        <Typography variant="h5">
          Transaction completed. Sandbox Order no: {processedOrder} emailed.
        </Typography>

        {byeBye && <Typography variant="h5">{byeBye}</Typography>}
      </Grid>

      <Grid item className={classes.minMaxWidth}>
        <Typography variant="body1">
          {firstName};<br />
          Give us your feedback.
          <br />
          Share with us your experience as an operator and as a client using
          Spinmor technology.
        </Typography>
      </Grid>

      {supportStatus !== status.finish && (
        <React.Fragment>
          <Grid
            item
            className={clsx(classes.minMaxWidth, classes.marginSpacing4)}
          >
            <TextField
              label="My experience"
              multiline
              rows={4}
              rowsMax={8}
              style={{ width: "80%" }}
              variant="outlined"
              required
              value={support}
              onChange={(e) => setSupport(e.target.value)}
            />
          </Grid>

          <Grid
            item
            className={clsx(classes.minMaxWidth, classes.marginSpacing2)}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={submitSupport}
              disabled={supportStatus === status.loading}
              endIcon={
                supportStatus === status.loading && (
                  <CircularProgress size="0.875rem" />
                )
              }
            >
              Submit
            </Button>
          </Grid>
        </React.Fragment>
      )}

      {supportStatus.split(" ")[0] === status.error && (
        <Grid
          item
          className={clsx(classes.minMaxWidth, classes.marginSpacing2)}
        >
          <Typography variant="body2" color="error">
            There was an error submitting your fedd back:{" "}
            {supportStatus.split(" ")[1]}. Please try again
          </Typography>
        </Grid>
      )}

      {supportStatus === status.finish && (
        <Grid
          item
          className={clsx(classes.minMaxWidth, classes.marginSpacing2)}
        >
          <Typography variant="h6" color="primary">
            Thank you {firstName}, we will be in touch soon
          </Typography>
          <Button
            color="primary"
            variant="contained"
            href={`${operatorAppHost}/?token=${token}`}
            target={operatorAppTitle}
            style={{ marginTop: 24 }}
          >
            Return to Operator Web Platform
          </Button>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SandboxByeBye);
