import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { drawerWidth } from "../Assets/consts";
import { exchangeFormat } from "../Assets/currencies";
import { status } from "../api/api";
import {
  setMyOrdersStatus,
  getMyOrdersAction,
  setOrderDetailsStatus,
  getOrderDetailsAction,
} from "../Redux/ReportReducer/Report.act";

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

  OrdersContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },
  title: {
    marginBottom: theme.spacing(2),
  },

  cardItem: {
    marginBottom: theme.spacing(3),
    minWidth: 280,
    maxWidth: theme.scannerWidth,
    padding: theme.spacing(1),
    flexWrap: "nowrap",
  },

  itemLine: {
    marginTop: theme.spacing(1),
  },
}));

const mapStateToProps = ({ AppReducer, ReportReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  myOrders: ReportReducer.myOrders,
  myOrdersStatus: ReportReducer.myOrdersStatus,

  orderDetailsStatus: ReportReducer.orderDetailsStatus,
  orderDetails: ReportReducer.orderDetails,
});
const mapDispatchToProps = (dispatch) => ({
  setMyOrdersStatus: bindActionCreators(setMyOrdersStatus, dispatch),
  getMyOrdersAction: bindActionCreators(getMyOrdersAction, dispatch),

  setOrderDetailsStatus: bindActionCreators(setOrderDetailsStatus, dispatch),
  getOrderDetailsAction: bindActionCreators(getOrderDetailsAction, dispatch),
});

function Orders({
  isMenuOpen,

  myOrders,
  getMyOrdersAction,
  myOrdersStatus,
  setMyOrdersStatus,

  orderDetailsStatus,
  orderDetails,
  setOrderDetailsStatus,
  getOrderDetailsAction,
}) {
  const classes = useStyles();

  //
  //cleanup on unmount
  React.useEffect(() => {
    setMyOrdersStatus(status.not_started);
    setOrderDetailsStatus(status.not_started);
  }, [setMyOrdersStatus, setOrderDetailsStatus]);

  //
  //
  React.useEffect(() => {
    if (myOrdersStatus === status.not_started) {
      getMyOrdersAction();
    }
  }, [getMyOrdersAction, myOrdersStatus]);

  //
  //
  const [expandedOrderId, setExpandedOrderId] = React.useState(-1);
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(orderId === expandedOrderId ? -1 : orderId);
  };
  React.useEffect(() => {
    if (expandedOrderId === -1) {
      setOrderDetailsStatus(status.not_started);
    } else {
      getOrderDetailsAction(expandedOrderId);
    }
  }, [expandedOrderId, getOrderDetailsAction, setOrderDetailsStatus]);

  //
  //
  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.OrdersContainer
      )}
      direction="column"
      alignItems="center"
      alignContent="center"
    >
      <div className={classes.drawerHeader} />

      <Grid item className={clsx(classes.minMaxWidth, classes.title)}>
        <Typography variant="h3">You have {myOrders.length} orders</Typography>
      </Grid>

      {myOrders.map((order, index) => (
        <Grid
          key={index}
          container
          item
          component={Card}
          className={classes.cardItem}
          direction="column"
        >
          <Grid container item direction="row" alignItems="center" padding={2}>
            <Grid item>
              <Typography variant="h6">
                <b>
                  <u>Order #{order.OrdersID}:</u>
                </b>
              </Typography>
            </Grid>

            {(!order.Status || order.Status?.trim?.() === "Sandbox") && (
              <Grid item>
                <Typography variant="subtitle1">&nbsp;(Sandbox)</Typography>
              </Grid>
            )}

            <div style={{ flexGrow: 1 }} />

            <Grid item>
              <IconButton onClick={() => toggleOrderDetails(order.OrdersID)}>
                {order.OrdersID === expandedOrderId ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </IconButton>
            </Grid>
          </Grid>

          <Grid item>
            <Typography variant="caption">
              {new Date(order.Date).toDateString()}
            </Typography>
          </Grid>

          <OrderDetails
            order={order}
            classes={classes}
            expandedOrderId={expandedOrderId}
            orderDetailsStatus={orderDetailsStatus}
            orderDetails={orderDetails}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function OrderDetails({
  order,
  classes,
  expandedOrderId,
  orderDetailsStatus,
  orderDetails,
}) {
  return (
    <Collapse in={order.OrdersID === expandedOrderId} timeout="auto">
      {orderDetailsStatus === status.loading && (
        <Grid item>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>
      )}

      {orderDetailsStatus.split(" ")[0] === status.error && (
        <Grid item>
          <Typography color="error">
            An error occurred: {orderDetailsStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {orderDetailsStatus === status.finish && (
        <React.Fragment>
          <Grid item className={classes.itemLine}>
            <PricesLine order={order} />
          </Grid>
          {orderDetails.map((item, index) => (
            <React.Fragment key={index}>
              <Grid container direction="row" item className={classes.itemLine}>
                <Grid item>
                  <Typography variant="body1">
                    <span style={{ fontSize: "0.85rem" }}>{item.Qty}x </span>
                    <i>{item.Description}</i>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container direction="row" item>
                <Grid item>
                  <Typography variant="caption">
                    Unit price {item.Total?.toFixed?.(2)}
                    {order.LocationCurrencySymobl} (tax {item.Tax?.toFixed?.(2)}
                    )
                  </Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </React.Fragment>
      )}
    </Collapse>
  );
}

function PricesLine({ order }) {
  return (
    <Typography variant="body2">
      <b>
        Total paid {order.TotalOrder?.toFixed?.(2)}
        &nbsp;{order.LocationCurrencySymobl}
      </b>
      <span style={{ fontSize: "0.7rem" }}>
        <br />
        Prepaid: {order.PaidWithPrepaidCredit?.toFixed?.(2)}
        <br />
        Credit card: {order.PaidWithCreditCard?.toFixed?.(2)}. Transaction #
        {order.CardTransactionID}
      </span>
    </Typography>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
