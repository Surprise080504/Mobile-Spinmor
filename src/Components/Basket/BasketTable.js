import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

import { exchangeFormat } from "../../Assets/currencies";
import { status } from "../../api/api";

import {
  getBasketItemsAction,
  setAddToBasketStatus,
  addItemToBasket,
  editBasketItem,
  setGetBasketItemsStatus,
} from "../../Redux/BasketReducer/Basket.act";

const useStyles = makeStyles((theme) => ({
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },
}));

const mapStateToProps = ({ AppReducer, BasketReducer }) => ({
  basketItems: BasketReducer.basketItems,
  getBasketItemsStatus: BasketReducer.getBasketItemsStatus,
  basketCurrency: BasketReducer.basketCurrency,

  currency: AppReducer.currency,
  exchangeRate: BasketReducer.exchangeRate,

  calculatedTax: BasketReducer.calculatedTax,
  calculatedTotalAmount: BasketReducer.calculatedTotalAmount,
  // totalPrice: BasketReducer.totalPrice,
  // totalTax: BasketReducer.totalTax,

  addToBasketStatus: BasketReducer.addToBasketStatus,

  editedBasketItem: BasketReducer.editedBasketItem,

  deleteBasketStatus: BasketReducer.deleteBasketStatus,
});
const mapDispatchToProps = (dispatch) => ({
  getBasketItemsAction: bindActionCreators(getBasketItemsAction, dispatch),
  setAddToBasketStatus: bindActionCreators(setAddToBasketStatus, dispatch),
  addItemToBasket: bindActionCreators(addItemToBasket, dispatch),
  editBasketItem: bindActionCreators(editBasketItem, dispatch),
  setGetBasketItemsStatus: bindActionCreators(
    setGetBasketItemsStatus,
    dispatch
  ),
});

function BasketTable({
  basketItems,
  getBasketItemsAction,
  getBasketItemsStatus,
  basketCurrency,

  currency,
  exchangeRate,

  calculatedTax,
  calculatedTotalAmount,

  addToBasketStatus,
  addItemToBasket,
  editBasketItem,
  editedBasketItem,
  setAddToBasketStatus,
  setGetBasketItemsStatus,

  deleteBasketStatus,
}) {
  const classes = useStyles();

  //initialize
  React.useEffect(() => {
    getBasketItemsAction();

    return function cleanup() {
      editBasketItem({
        qr: "",
        ItemListId: -1,
        qty: 0,
        ItemName: "",
      });

      setAddToBasketStatus(status.not_started);
      setGetBasketItemsStatus(status.not_started);
    };
  }, [
    getBasketItemsAction,
    editBasketItem,
    setAddToBasketStatus,
    setGetBasketItemsStatus,
  ]);

  //get entire basket again when changing quantity of item or deleting the basket
  React.useEffect(() => {
    if (
      addToBasketStatus === status.finish ||
      deleteBasketStatus === status.finish
    ) {
      getBasketItemsAction();
    }
  }, [addToBasketStatus, deleteBasketStatus, getBasketItemsAction]);

  //used to show loader only once
  const [itemsChangeCounter, setItemsChangeCounter] = React.useState(0);
  React.useEffect(() => {
    if (getBasketItemsStatus === status.finish) {
      setItemsChangeCounter((itemsChangeCounter) => itemsChangeCounter + 1);
    }
  }, [getBasketItemsStatus]);

  //remove item
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const alertDelete = (itemToDelete) => {
    setIsAlertOpen(true);
    editBasketItem({
      qr: itemToDelete.QRCodetoReturn,
      ItemListId: itemToDelete.ItemListId,
      qty: itemToDelete.Quantity * -1,
      ItemName: itemToDelete.ItemName,
    });
  };

  const cancelDelete = () => {
    if (
      getBasketItemsStatus === status.loading ||
      addToBasketStatus === status.loading
    ) {
      return;
    }

    setIsAlertOpen(false);
    setAddToBasketStatus(status.not_started);
  };
  const confirmDelete = () => {
    addItemToBasket({ editedInBasket: true });
  };

  React.useEffect(() => {
    if (getBasketItemsStatus === status.finish) {
      setIsAlertOpen(false);
    }
  }, [getBasketItemsStatus]);

  const updateQty = (itemToUpdate, qty) => {
    if (qty === -1 && itemToUpdate.Quantity === 1) {
      alertDelete(itemToUpdate);
      return;
    }

    editBasketItem({
      qr: itemToUpdate.QRCodetoReturn,
      ItemListId: itemToUpdate.ItemListId,
      qty,
      ItemName: itemToUpdate.ItemName,
    });
    addItemToBasket({ editedInBasket: true });
  };

  return (
    <React.Fragment>
      {getBasketItemsStatus === status.loading && itemsChangeCounter === 0 && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      {getBasketItemsStatus.split(" ")[0] === status.error && (
        <Grid item className={classes.minMaxWidth}>
          <Typography variant="body2" align="left">
            Error getting your basket {getBasketItemsStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {basketItems.length === 0 && getBasketItemsStatus === status.finish && (
        <Grid item className={classes.minMaxWidth}>
          <Typography variant="h6" align="center">
            No items in your basket&nbsp;
            <Link component={RouterLink} to="/">
              start scanning
            </Link>
          </Typography>
        </Grid>
      )}

      {(getBasketItemsStatus.split(" ")[0] === status.error ||
        addToBasketStatus.split(" ")[0] === status.error) &&
        itemsChangeCounter > 0 && (
          <Grid item className={classes.minMaxWidth}>
            <Typography variant="body2" align="left">
              Error updating item quantity{" "}
              {getBasketItemsStatus
                ? getBasketItemsStatus.split(" ")[1]
                : addToBasketStatus.split(" ")[1]}
            </Typography>
          </Grid>
        )}

      {basketItems.length > 0 && itemsChangeCounter > 0 && (
        <Grid item className={classes.minMaxWidth}>
          <TableContainer component={Paper} style={{ marginTop: 16 }}>
            <Table aria-label="basket table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="left" scope="col">
                    Quantity
                  </TableCell>
                  <TableCell align="left" scope="col">
                    Item
                  </TableCell>
                  <TableCell align="center" scope="col">
                    Price
                  </TableCell>
                  <TableCell align="right" scope="col">
                    Extended
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {basketItems.map((item) => (
                  <TableRow key={item.ItemListId}>
                    <TableCell padding="checkbox">
                      <IconButton
                        onClick={() => alertDelete(item)}
                        disabled={
                          getBasketItemsStatus === status.loading ||
                          addToBasketStatus === status.loading
                        }
                      >
                        {(getBasketItemsStatus === status.loading ||
                          addToBasketStatus === status.loading) &&
                        item.ItemListId === editedBasketItem.ItemListId ? (
                          <CircularProgress size="1.5rem" />
                        ) : (
                          <DeleteForeverOutlinedIcon />
                        )}
                      </IconButton>
                    </TableCell>

                    <TableCell align="left">
                      <IconButton
                        onClick={() => updateQty(item, -1)}
                        disabled={
                          getBasketItemsStatus === status.loading ||
                          addToBasketStatus === status.loading
                        }
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                      {item.Quantity}
                      <IconButton
                        onClick={() => updateQty(item, 1)}
                        disabled={
                          getBasketItemsStatus === status.loading ||
                          addToBasketStatus === status.loading
                        }
                      >
                        <AddCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>

                    <TableCell align="left">{item.ItemName}</TableCell>

                    <TableCell align="center">
                      {exchangeFormat({
                        localPrice: item.Price,
                        fromCurrency: basketCurrency,
                        toCurrency: currency.iso,
                        exchangeRate,
                        caller: "table price",
                      })}
                    </TableCell>

                    <TableCell align="right">
                      {exchangeFormat({
                        localPrice: item.Price,
                        fromCurrency: basketCurrency,
                        toCurrency: currency.iso,
                        exchangeRate,
                        caller: "table extended",
                        pieces: item.Quantity,
                      })}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell />
                  <TableCell>Tax</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell align="right">
                    {exchangeFormat({
                      localPrice: calculatedTax,
                      fromCurrency: basketCurrency,
                      toCurrency: currency.iso,
                      exchangeRate,
                      caller: "table tax",
                    })}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontWeight: "bold" }}>
                    Total amount
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell style={{ fontWeight: "bold" }} align="right">
                    {exchangeFormat({
                      localPrice: calculatedTotalAmount,
                      fromCurrency: basketCurrency,
                      toCurrency: currency.iso,
                      exchangeRate,
                      caller: "table amount",
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      <Dialog
        open={isAlertOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete item</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want delete {editedBasketItem.ItemName}?
          </DialogContentText>

          {(getBasketItemsStatus === status.loading ||
            addToBasketStatus === status.loading) && <CircularProgress />}

          {(getBasketItemsStatus.split(" ")[0] === status.error ||
            addToBasketStatus.split(" ")[0] === status.error) &&
            itemsChangeCounter > 0 && (
              <Typography variant="body2" align="left">
                Error updating item quantity{" "}
                {getBasketItemsStatus
                  ? getBasketItemsStatus.split(" ")[1]
                  : addToBasketStatus.split(" ")[1]}
              </Typography>
            )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={confirmDelete}
            color="primary"
            disabled={
              getBasketItemsStatus === status.loading ||
              addToBasketStatus === status.loading
            }
          >
            Delete
          </Button>

          <Button
            onClick={cancelDelete}
            color="primary"
            autoFocus
            disabled={
              getBasketItemsStatus === status.loading ||
              addToBasketStatus === status.loading
            }
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BasketTable);
