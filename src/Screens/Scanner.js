import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link as RouterLink } from "react-router-dom";

import QrReader from "react-qr-reader";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ScannedItem from "../Components/Scanner/ScannedItem";
import GoodImage from "../Components/Scanner/GoodImage";

import { drawerWidth, defaultScanDelay } from "../Assets/consts";

import {
  setScanError,
  getItemByQr,
  getLocationByQR,
  handleScan,
  setGetItemError,
  setScanDelay,
  setScannerReadyOnce,
} from "../Redux/ScannerReducer/Scanner.act";
import { getBasketItemsAction } from "../Redux/BasketReducer/Basket.act";
import { status } from "../api/api";
import useDimensions from "../Hooks/useDimensions";
import CButton from "../Components/Custom/CButton";
import scanIcon from "../Assets/icons/Scan-Again.gif";
import rewardsIcon from "../Assets/icons/Rewards.gif";
import addbasketIcon from "../Assets/icons/Add-gto-basket.gif";

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
  scannerContainer: {
    marginBottom: theme.spacing(3),
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
  maxWidth: {
    maxWidth: theme.scannerWidth,
  },
  readerContainer: {
    paddingTop: theme.spacing(2),
    width: "100%",
  },
  allowPermission: {
    color: theme.palette.primary.main,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
  },
  scanErrorStyle: {
    color: theme.palette.error.main,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
  },

  "@keyframes scannerBorderAnimation": {
    "25%": {
      borderStyle: "solid",
      borderWidth: 3,
      borderColor: theme.palette.primary.main,
    },
    "50%": {
      borderStyle: "solid",
      borderWidth: 3,
      borderColor: theme.palette.primary.light,
    },
    "100%": {
      borderStyle: "solid",
      borderWidth: 3,
      borderColor: theme.palette.primary.main,
    },
  },
  scanner: {
    width: "100%",
    maxWidth: theme.scannerWidth,
    boxSizing: "border-box",
    alignSelf: "center",
    // "& section": {
    //   position: "absolute",
    // },
    // borderStyle: "solid",
    // borderWidth: 3,
    // borderColor: theme.palette.primary.main,
  },
  scannerWorking: {
    animationName: "$scannerBorderAnimation",
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
  },
  grayFilter: {
    filter: "grayscale(90%)",
  },
  itemLoadingFilter: {
    filter: "grayscale(100%)",
  },

  basketRow: {
    marginTop: theme.spacing(0.5),
  },
}));

const mapStateToProps = ({ AppReducer, ScannerReducer, BasketReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,
  firstName: AppReducer.firstName,
  lastName: AppReducer.lastName,

  scannerReadyOnce: ScannerReducer.scannerReadyOnce,
  delay: ScannerReducer.delay,
  isScanSuccess: ScannerReducer.isScanSuccess,
  scanResult: ScannerReducer.scanResult,
  scanError: ScannerReducer.scanError,
  getItemLoading: ScannerReducer.getItemLoading,
  getItemError: ScannerReducer.getItemError,

  totalQty: BasketReducer.totalQty,
  totalPrice: BasketReducer.totalPrice,
  creditBalance: BasketReducer.creditBalance,
  currency: AppReducer.currency,
  exchangeRate: BasketReducer.exchangeRate,
  basketCurrency: BasketReducer.basketCurrency,
  getBasketItemsStatus: BasketReducer.getBasketItemsStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setScannerReadyOnce: bindActionCreators(setScannerReadyOnce, dispatch),
  getItemByQr: bindActionCreators(getItemByQr, dispatch),
  getLocationByQR: bindActionCreators(getLocationByQR, dispatch),
  handleScan: bindActionCreators(handleScan, dispatch),

  setScanError: bindActionCreators(setScanError, dispatch),

  setGetItemError: bindActionCreators(setGetItemError, dispatch),
  setScanDelay: bindActionCreators(setScanDelay, dispatch),

  getBasketItemsAction: bindActionCreators(getBasketItemsAction, dispatch)
});

function Scanner({
  isMenuOpen,
  firstName,
  lastName,

  scannerReadyOnce,
  setScannerReadyOnce,
  delay,
  handleScan,
  scanResult,
  scanError,
  setScanError,
  isScanSuccess,

  getItemError,
  setGetItemError,
  setScanDelay,

  getItemByQr,
  getLocationByQR,
  getItemLoading,

  totalPrice,
  creditBalance,
  totalQty,

  currency,
  exchangeRate,
  basketCurrency,

  getBasketItemsStatus,
  getBasketItemsAction,
}) {
  const classes = useStyles();

  const onScannerLoad = () => {
    if (scannerReadyOnce) {
      return;
    } else {
      setScannerReadyOnce(true);
    }
  };

  const afterScanSuccess = async () => {
    await getItemByQr();
    await getLocationByQR();
  }

  React.useEffect(() => {
    if (getBasketItemsStatus === status.not_started)
      getBasketItemsAction();
  }, []);

  React.useEffect(() => {
    if (!isScanSuccess) {
      return;
    }
    afterScanSuccess();
  }, [isScanSuccess]);

  const handleScanError = (err) => {
    console.error(err);
    setScanError(err?.message || "unknown scan error");
  };

  const closeScanErrorMessage = () => {
    setGetItemError(null);
    setScanDelay(defaultScanDelay);
  };

  const [ref, dimensions] = useDimensions();

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.scannerContainer
      )}
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <div className={classes.drawerHeader} />

      <Grid
        container
        direction="row"
        item
        className={clsx(classes.readerContainer, classes.maxWidth)}
        justifyContent="flex-start"
      >
        <div style={{ width: "100%", position: "relative" }} ref={ref}>
          {!scannerReadyOnce && !scanError && (
            <Typography
              variant="h4"
              align="center"
              className={classes.allowPermission}
            >
              Please allow camera access
            </Typography>
          )}

          {scanError && (
            <Typography
              variant="h4"
              align="center"
              className={classes.scanErrorStyle}
            >
              We are unable to access your camera: {scanError}
            </Typography>
          )}

          <QrReader
            delay={delay}
            onError={handleScanError}
            onScan={handleScan}
            onLoad={onScannerLoad}
            className={clsx(
              // classes.scanner,
              // getItemLoading === false && delay === false && classes.grayFilter,
              delay === false && classes.grayFilter
              // getItemLoading && classes.grayFilter
              // getItemLoading && classes.scannerWorking
            )}
            showViewFinder={false}
          // style={{ filter: getItemLoading ? "grayscale(100%)" : "" }}
          // style={!!getItemLoading ? { filter: "grayscale(100%)" } : {}}
          // style={delay === false ? { filter: "grayscale(100%)" } : {}}
          />

          {scanResult && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <GoodImage QRCode={scanResult} parentDimensions={dimensions} />
            </div>
          )}
        </div>
      </Grid>
      <Typography
        variant="h4"
        align="center"
      >
        {`G'day ${firstName} ${lastName}`}
      </Typography>
      <ScannedItem />
      <Grid
        container
        direction="column"
        item
        className={clsx(classes.readerContainer, classes.maxWidth)}
      >
        <CButton imgURL={scanIcon} text="Scan QR Code to Proceed"></CButton>
        <CButton imgURL={addbasketIcon} text="Add to Basket" blur={true}></CButton>
        <CButton imgURL={rewardsIcon} text="View Rewards"></CButton>
      </Grid>
      {/** discard dialog */}
      <Dialog
        open={Boolean(getItemError)}
        onClose={closeScanErrorMessage}
        aria-labelledby="scan-error-message"
        aria-describedby="scan-error-message-description"
      >
        <DialogTitle id="scan-error-message">Not a Spinmor QR code</DialogTitle>
        <DialogContent>
          <DialogContentText id="scan-error-message-description">
            Click OK to scan again
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeScanErrorMessage} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

Scanner.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  handleScan: PropTypes.func.isRequired,
  scanResult: PropTypes.string,
  scanError: PropTypes.string,
  setScanError: PropTypes.func.isRequired,
  isScanSuccess: PropTypes.bool.isRequired,

  getItemByQr: PropTypes.func.isRequired,
  getItemLoading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scanner);
