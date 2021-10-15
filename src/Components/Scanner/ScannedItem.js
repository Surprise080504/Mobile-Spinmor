import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

import {
  setIsInputEmpty,
  onInputChange,
  setGetItemError,
  setQrItem,
  setScanDelay,
  setQty,
  setGetItemReviewsStatus,
  setScanResult,
} from "../../Redux/ScannerReducer/Scanner.act";
import {
  addItemToBasket,
  setAddToBasketStatus,
} from "../../Redux/BasketReducer/Basket.act";

import { status } from "../../api/api";
import { defaultScanDelay } from "../../Assets/consts";
import { exchangeFormat } from "../../Assets/currencies";
import ReviewsSummary from "../Reviews/ReviewsSummary";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.scannerWidth,
    marginTop: theme.spacing(1),
  },
  titleDivider: {
    marginTop: theme.spacing(0.5),
  },

  qtyButtons: {
    padding: 0,
    zIndex: 10,
  },
  alignInputText: {
    "& .MuiInputBase-input": {
      textAlign: "center",
    },
    "& .MuiOutlinedInput-inputMarginDense": {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  },

  addToBasketContainer: {
    marginTop: theme.spacing(2),
  },
  loader: {
    alignSelf: "center",
    // marginTop: theme.spacing(1),
  },
  successMessageItem: {
    marginTop: theme.spacing(1),
  },

  actionsSectionContainer: {
    marginTop: theme.spacing(2),
  },
  actionsContainer: {
    // paddingTop: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const mapStateToProps = ({ AppReducer, ScannerReducer, BasketReducer }) => ({
  getItemError: ScannerReducer.getItemError,
  qrItem: ScannerReducer.qrItem,
  isInputEmpty: ScannerReducer.isInputEmpty,
  qty: ScannerReducer.qty,
  totalQty: BasketReducer.totalQty,
  totalPrice: BasketReducer.totalPrice,
  exchangeRate: BasketReducer.exchangeRate,

  currency: AppReducer.currency,

  addToBasketStatus: BasketReducer.addToBasketStatus,
  createBasketStatus: BasketReducer.createBasketStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setIsInputEmpty: bindActionCreators(setIsInputEmpty, dispatch),
  onInputChange: bindActionCreators(onInputChange, dispatch),
  setGetItemError: bindActionCreators(setGetItemError, dispatch),
  setQrItem: bindActionCreators(setQrItem, dispatch),
  setScanDelay: bindActionCreators(setScanDelay, dispatch),
  addItemToBasket: bindActionCreators(addItemToBasket, dispatch),
  setAddToBasketStatus: bindActionCreators(setAddToBasketStatus, dispatch),
  setQty: bindActionCreators(setQty, dispatch),
  setGetItemReviewsStatus: bindActionCreators(
    setGetItemReviewsStatus,
    dispatch
  ),
  setScanResult: bindActionCreators(setScanResult, dispatch),
});

function ScannedItem({
  getItemError,
  qrItem,
  isInputEmpty,
  setIsInputEmpty,
  qty,
  setQty,
  onInputChange,
  setGetItemError,
  setQrItem,
  setGetItemReviewsStatus,

  setScanDelay,
  totalQty,
  totalPrice,
  setScanResult,

  currency,
  exchangeRate,

  addItemToBasket,
  addToBasketStatus,
  setAddToBasketStatus,
}) {
  const classes = useStyles();

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const alertClose = () => {
    setIsAlertOpen(true);
  };

  const confirmDiscard = () => {
    setIsAlertOpen(false);
    handleClose();
  };
  const cancelDiscard = () => {
    setIsAlertOpen(false);
  };

  const handleClose = () => {
    if (isAlertOpen) {
      setIsAlertOpen(false);
    }
    setAddToBasketStatus(status.not_started);
    setGetItemError(null);
    setQrItem(null);
    setScanDelay(defaultScanDelay);
    setQty(1);
    setGetItemReviewsStatus(status.not_started);
    setScanResult(null);
  };

  const minusOne = () => {
    onInputChange(-1, false);
  };
  const plusOne = () => {
    onInputChange(1, false);
  };
  const focusInput = (e) => {
    if (qty === 0) {
      e.target.select();
    }
  };

  const scannedItemRef = React.useRef();
  React.useEffect(() => {
    if (!qrItem) {
      return;
    }
    scannedItemRef.current.scrollIntoView({ behavior: "smooth" });
  }, [qrItem]);

  React.useEffect(() => {
    if (addToBasketStatus === status.finish) {
      setAddToBasketStatus(status.not_started);
      setGetItemError(null);
      setQrItem(null);
      setScanDelay(defaultScanDelay);
    }

    return function cleanup() {
      if (addToBasketStatus === status.finish) {
        console.log("cleanup");
        setAddToBasketStatus(status.not_started);
        setGetItemError(null);
        setQrItem(null);
        setScanDelay(defaultScanDelay);
        setQty(1);
      }
    };
  }, [
    addToBasketStatus,
    setAddToBasketStatus,
    setGetItemError,
    setQrItem,
    setQty,
    setScanDelay,
  ]);

  return (
    !!qrItem && (
      <React.Fragment>
        <Grid
          ref={scannedItemRef}
          container
          item //item of main container in <Scanner />
          direction="column"
          className={classes.root}
        >
          {/**title */}
          <Grid item xs={12}>
            <Typography variant="h5">
              {/*getItemError
                ? "Error occurred searching for this item"
                : qrItem
                ? qrItem.ItemName
              : "Unknown problem"*/}

              {addToBasketStatus !== status.finish && qrItem.ItemName}
            </Typography>
            <Divider className={classes.titleDivider} light />
          </Grid>

          {/**body */}
          <Grid container item direction="column" alignItems="center">
            {
              /** add to basket controls */
              addToBasketStatus !== status.finish && (
                <React.Fragment>
                  {
                    /** error status */
                    addToBasketStatus.split(" ")[0] === status.error && (
                      <Grid item>
                        <Typography variant="body2">
                          Error adding to basket:{" "}
                          {addToBasketStatus.split(" ")[1]}, please try again
                        </Typography>
                      </Grid>
                    )
                  }

                  <Grid
                    container
                    item
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    alignContent="flex-start"
                  >
                    <Grid item xs={5}>
                      <TextField
                        type="number"
                        variant="outlined"
                        value={isInputEmpty ? "" : qty}
                        size="small"
                        onFocus={focusInput}
                        onChange={(e) => onInputChange(e.target.value, true)}
                        onBlur={() => setIsInputEmpty(false)}
                        disabled={addToBasketStatus === status.loading}
                        InputProps={{
                          className: classes.alignInputText,
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                disabled={qty === 0}
                                onClick={minusOne}
                                className={classes.qtyButtons}
                              >
                                <RemoveCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={plusOne}
                                className={classes.qtyButtons}
                              >
                                <AddCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <Typography variant="body1" align="right">
                        {exchangeFormat({
                          localPrice: qrItem.TaxIncluded,
                          fromCurrency: qrItem.Currency,
                          toCurrency: currency.iso,
                          exchangeRate,
                          pieces: qty,
                          caller: "ScannedItem",
                        })}
                        <br />
                        <Typography variant="caption">
                          {" "}
                          (tax included)
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    item
                    direction="row"
                    justify="center"
                    className={classes.addToBasketContainer}
                  >
                    <Grid item>
                      <Button
                        size="small"
                        disabled={
                          qty === 0 || addToBasketStatus === status.loading
                        }
                        startIcon={
                          addToBasketStatus === status.loading ? (
                            <CircularProgress size="0.8125rem" />
                          ) : (
                            <AddShoppingCartIcon />
                          )
                        }
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          addItemToBasket();
                          setScanResult(null);
                        }}
                      >
                        Add to basket
                      </Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )
            }

            {
              /** finish status */
              addToBasketStatus === status.finish && (
                <Grid item className={classes.successMessageItem}>
                  <Typography variant="body1" align="center">
                    {qrItem.ItemName} added to your basket
                  </Typography>
                </Grid>
              )
            }

            {/**reviews section */}
            <ReviewsSummary />
          </Grid>

          {/**actions */}
          <Grid
            container
            item
            direction="column"
            className={classes.actionsSectionContainer}
          >
            <Grid item>
              <Divider />
            </Grid>

            <Grid
              container
              item
              direction="row"
              justify="space-between"
              className={classes.actionsContainer}
            >
              <Button
                onClick={
                  addToBasketStatus !== status.finish ? alertClose : handleClose
                }
                color="primary"
                variant={
                  qty === 0 || addToBasketStatus === status.finish
                    ? "contained"
                    : "text"
                }
                disabled={addToBasketStatus === status.loading}
              >
                {addToBasketStatus !== status.finish
                  ? "Discard & Scan More"
                  : "Scan More"}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/** discard dialog */}
        <Dialog
          open={isAlertOpen}
          onClose={cancelDiscard}
          aria-labelledby="discard-dialog-title"
          aria-describedby="discrad-dialog-description"
        >
          <DialogTitle id="discard-dialog-title">
            Discard this item?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="discrad-dialog-description">
              Are you sure you want discard this item
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDiscard} color="primary">
              Discard
            </Button>
            <Button onClick={cancelDiscard} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  );
}

ScannedItem.propTypes = {
  setScanDelay: PropTypes.func.isRequired,

  getItemError: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  qrItem: PropTypes.object,

  isInputEmpty: PropTypes.bool.isRequired,
  setIsInputEmpty: PropTypes.func.isRequired,
  qty: PropTypes.number.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScannedItem);
