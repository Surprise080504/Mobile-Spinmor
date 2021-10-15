import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbsUpDownOutlinedIcon from "@material-ui/icons/ThumbsUpDownOutlined";

import { drawerWidth } from "../Assets/consts";
import { status } from "../api/api";
import {
  getItemReviewsAction,
  setGetItemReviewsStatus,
} from "../Redux/ScannerReducer/Scanner.act";

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

  reviewsContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  minMaxWidth: {
    width: "100%",
    maxWidth: theme.scannerWidth,
  },

  back: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  loader: {
    marginTop: theme.spacing(2),
  },

  listItem: {
    // marginTop: theme.spacing(2),
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  thumbsUp: {
    color: theme.palette.info.dark,
  },
  thumbsUpDown: {
    color: theme.palette.warning.main,
  },
  thumbsDown: {
    color: theme.palette.error.dark,
  },
}));

const mapStateToProps = ({ AppReducer, ScannerReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,

  qrItem: ScannerReducer.qrItem,
  getItemReviewsStatus: ScannerReducer.getItemReviewsStatus,
  itemReviews: ScannerReducer.itemReviews,
});
const mapDispatchToProps = (dispatch) => ({
  getItemReviewsAction: bindActionCreators(getItemReviewsAction, dispatch),
  setGetItemReviewsStatus: bindActionCreators(
    setGetItemReviewsStatus,
    dispatch
  ),
});

function Reviews({
  isMenuOpen,

  getItemReviewsStatus,
  getItemReviewsAction,
  qrItem,
  itemReviews,
  setGetItemReviewsStatus,
}) {
  const classes = useStyles();

  const history = useHistory();
  // const { itemId } = useParams();

  React.useEffect(() => {
    if (getItemReviewsStatus === status.not_started) {
      getItemReviewsAction();
    }
  }, [getItemReviewsStatus, getItemReviewsAction]);

  React.useEffect(() => {
    return function cleanup() {
      console.log("cleanup called");
      setGetItemReviewsStatus(status.not_started);
    };
  }, [setGetItemReviewsStatus]);

  return (
    <Grid
      container
      className={clsx(
        classes.content,
        isMenuOpen && classes.contentShift,
        classes.reviewsContainer
      )}
      direction="column"
      alignItems="center"
      alignContent="center"
    >
      <div className={classes.drawerHeader} />

      <Grid item className={clsx(classes.minMaxWidth, classes.back)}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIcon />}
        >
          back to scanner
        </Button>
      </Grid>

      {getItemReviewsStatus.split(" ")[0] === status.error && (
        <Grid item className={clsx(classes.minMaxWidth, classes.title)}>
          <Typography variant="h5" align="left">
            There was an error getting item reviews:{" "}
            {getItemReviewsStatus.split(" ")[1]}
          </Typography>
        </Grid>
      )}

      {qrItem && (
        <Grid item className={clsx(classes.minMaxWidth, classes.title)}>
          <Typography variant="h4" align="left">
            {qrItem.ItemName} reviews
          </Typography>
        </Grid>
      )}

      {getItemReviewsStatus === status.loading && (
        <Grid item className={classes.loader}>
          <CircularProgress />
        </Grid>
      )}

      {/*(<Grid item className={classes.minMaxWidth}>
        <Typography>Description of item can go here</Typography>
        -----------
      </Grid>)*/}

      {getItemReviewsStatus === status.finish && (
        <Grid item className={clsx(classes.minMaxWidth, classes.listItem)}>
          <List className={classes.list}>
            {itemReviews.map((review, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    {review.Likes === "y" && <ThumbUpOutlinedIcon />}
                    {review.Indifferent === "y" && <ThumbsUpDownOutlinedIcon />}
                    {review.DisLikes === "y" && <ThumbDownOutlinedIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={review.Comment || "no comment"}
                  secondary={review.Date}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      )}
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);
