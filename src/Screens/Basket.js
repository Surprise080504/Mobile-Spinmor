import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { status } from "../api/api";
import { drawerWidth } from "../Assets/consts";
import { exchangeFormat } from "../Assets/currencies";
import {
  deleteBasketAction,
  setDeleteBasketStatus,
} from "../Redux/BasketReducer/Basket.act";
import { loginAction } from "../Redux/AppReducer/App.act";

import BasketTable from "../Components/Basket/BasketTable";

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

  basketContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },

  prepaidItem: {
    marginBottom: theme.spacing(2),
  },

  proceedItem: {
    marginTop: theme.spacing(3),
  },
  basketButtonsContainer: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  basketItems: BasketReducer.basketItems,
  getBasketItemsStatus: BasketReducer.getBasketItemsStatus,

  basketLocation: BasketReducer.basketLocation,
  creditBalance: BasketReducer.creditBalance,
  currency: AppReducer.currency,
  exchangeRate: BasketReducer.exchangeRate,

  deleteBasketStatus: BasketReducer.deleteBasketStatus,
});
const mapDispatchToProps = (dispatch) => ({
  deleteBasketAction: bindActionCreators(deleteBasketAction, dispatch),
  setDeleteBasketStatus: bindActionCreators(setDeleteBasketStatus, dispatch),

  loginAction: bindActionCreators(loginAction, dispatch),
});

function Basket({
  isMenuOpen,

  basketItems,
  getBasketItemsStatus,

  basketLocation,
  creditBalance,
  currency,
  exchangeRate,

  deleteBasketStatus,
  deleteBasketAction,
  setDeleteBasketStatus,

  loginAction,
}) {
  const classes = useStyles();

  //
  //
  React.useEffect(() => {
    loginAction();
  }, [loginAction]);

  //
  //
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const alertDeleteAll = () => {
    setIsAlertOpen(true);
  };

  const cancelDeleteAll = () => {
    if (deleteBasketStatus === status.loading) {
      return;
    }

    setIsAlertOpen(false);
    setDeleteBasketStatus(status.not_started);
  };
  const confirmDelete = () => {
    deleteBasketAction();
  };

  React.useEffect(() => {
    if (deleteBasketStatus === status.finish) {
      setIsAlertOpen(false);
    }
  }, [deleteBasketStatus]);

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.basketContainer
      )}
      direction="column"
      alignItems="center"
      alignContent="center"
    >
      <div className={classes.drawerHeader} />

      {basketItems.length > 0 && getBasketItemsStatus === status.finish && (
        <Grid item className={classes.minMaxWidth}>
          <Typography variant="h5" align="left">
            Your basket at: {basketLocation}
          </Typography>
        </Grid>
      )}

      <Grid item className={clsx(classes.minMaxWidth, classes.prepaidItem)}>
        <Typography variant="h6" align="left">
          Prepaid credit:{" "}
          {exchangeFormat({
            localPrice: creditBalance,
            fromCurrency: "USD",
            toCurrency: currency.iso,
            exchangeRate,
            caller: "prepaid balance",
          })}
        </Typography>
      </Grid>

      <BasketTable />

      {basketItems.length > 0 && getBasketItemsStatus === status.finish && (
        <React.Fragment>
          <Grid item className={classes.proceedItem}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/payment"
            >
              Proceed to payment
            </Button>
          </Grid>

          <Grid
            container
            item
            className={clsx(
              classes.minMaxWidth,
              classes.basketButtonsContainer
            )}
            justify="space-between"
          >
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/"
              >
                Scan More
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={alertDeleteAll}
              >
                Clear Basket
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      )}

      <Dialog
        open={isAlertOpen}
        onClose={cancelDeleteAll}
        aria-labelledby="delete-all-dialog-title"
        aria-describedby="delete-all-dialog-description"
      >
        <DialogTitle id="delete-all-dialog-title">Delete basket</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-all-dialog-description">
            Are you sure you want to delete all items in your basket?
          </DialogContentText>

          {deleteBasketStatus === status.loading && <CircularProgress />}

          {deleteBasketStatus.split(" ")[0] === status.error && (
            <Typography variant="body2" align="left">
              Error deleting basket: {deleteBasketStatus.split(" ")[1]}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={confirmDelete}
            color="primary"
            disabled={deleteBasketStatus === status.loading}
          >
            Delete
          </Button>

          <Button
            onClick={cancelDeleteAll}
            color="primary"
            autoFocus
            disabled={deleteBasketStatus === status.loading}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
