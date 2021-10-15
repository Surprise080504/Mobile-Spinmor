import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { drawerWidth } from "../Assets/consts";
import {
  deleteBasketAction,
  setDeleteBasketStatus,
} from "../Redux/BasketReducer/Basket.act";

import SandboxSplitPayment from "../Components/Payment/SandboxSplitPayment";
import SandboxByeBye from "../Components/Payment/SandboxByeBye";
import SplitPayment from "../Components/Payment/SplitPayment";
import ConfirmPayment from "../Components/Payment/ConfirmPayment";
import SelectCreditCard from "../Components/Payment/SelectCreditCard";
import ByeBye from "../Components/Payment/ByeBye";

function getStepContent(step, prodStatus) {
  switch (step) {
    case 0:
      return prodStatus === "Sandbox" ? (
        <SandboxSplitPayment />
      ) : (
        <SplitPayment />
      );
    case 1:
      return <ConfirmPayment />;
    case 2:
      return <SelectCreditCard />;
    case 3:
      return prodStatus === "Sandbox" ? <SandboxByeBye /> : <ByeBye />;
    default:
      return "Unknown step";
  }
}

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
  },

  paymentContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },

  emptyBasket: {
    marginTop: theme.spacing(5),
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer, PaymentReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,
  prodStatus: AppReducer.prodStatus,

  totalPrice: BasketReducer.totalPrice,

  paymentStage: PaymentReducer.paymentStage,
});
const mapDispatchToProps = (dispatch) => ({
  deleteBasketAction: bindActionCreators(deleteBasketAction, dispatch),
  setDeleteBasketStatus: bindActionCreators(setDeleteBasketStatus, dispatch),
});

function Payment({
  isMenuOpen,
  prodStatus,

  totalPrice,

  paymentStage,
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.paymentContainer
      )}
      direction="column"
      alignItems="center"
      alignContent="center"
    >
      <div className={classes.drawerHeader} />

      <Grid item className={classes.minMaxWidth}>
        <Typography variant="h3">
          Checkout
          {prodStatus === "Sandbox" && (
            <span
              style={{ color: "red", fontSize: "65%", whiteSpace: "nowrap" }}
            >
              &nbsp;(Sandbox status)
            </span>
          )}
        </Typography>
      </Grid>

      {totalPrice == 0 && (
        <Grid item className={clsx(classes.minMaxWidth, classes.emptyBasket)}>
          <Typography variant="h5" align="center">
            No items in your basket&nbsp;
            <Link component={RouterLink} to="/">
              start scanning
            </Link>
          </Typography>
        </Grid>
      )}

      {totalPrice != 0 && getStepContent(paymentStage, prodStatus)}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
