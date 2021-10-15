import React from "react";
// import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbsUpDownOutlinedIcon from "@material-ui/icons/ThumbsUpDownOutlined";

import { getItemLikesAction } from "../../Redux/ScannerReducer/Scanner.act";
import { status } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  reviewsContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  likeButton: {
    alignItems: "flex-end",
    minWidth: theme.spacing(6.5),
  },
  thumbsUp: {
    color: theme.palette.info.dark,
    paddingRight: theme.spacing(0.5),
  },
  thumbsUpDown: {
    color: theme.palette.warning.main,
    paddingRight: theme.spacing(0.5),
  },
  thumbsDown: {
    color: theme.palette.error.dark,
    paddingRight: theme.spacing(0.5),
  },
  readReviewsGridItem: {
    alignSelf: "flex-end",
  },

  loader: {
    width: "100%",
    maxWidth: theme.spacing(8 * 2),
    marginTop: theme.spacing(3),
  },

  noReviewsItem: {
    paddingTop: theme.spacing(2),
  },
  // noReviewsStyle: {
  //   borderStyle: "solid",
  //   borderWidth: 2,
  //   borderRadius: 4,
  //   borderColor: theme.palette.text.primary,
  // },
}));

const mapStateToProps = ({ ScannerReducer, BasketReducer }) => ({
  itemId: ScannerReducer.qrItem.ItemListId,
  getItemLikesStatus: ScannerReducer.getItemLikesStatus,
  itemLikes: ScannerReducer.itemLikes,

  addToBasketStatus: BasketReducer.addToBasketStatus,
});
const mapDispatchToProps = (dispatch) => ({
  getItemLikesAction: bindActionCreators(getItemLikesAction, dispatch),
});

function ReviewsSummary({
  itemId,
  getItemLikesStatus,
  itemLikes,
  getItemLikesAction,
  addToBasketStatus,
}) {
  const classes = useStyles();

  React.useEffect(() => {
    if (getItemLikesStatus === status.not_started) {
      getItemLikesAction();
    }
  }, [getItemLikesAction, getItemLikesStatus]);

  const [noReviewsYet, setNoReviewsYet] = React.useState(false);
  React.useEffect(() => {
    if (
      getItemLikesStatus &&
      getItemLikesStatus.split(" ")[0] === status.error
    ) {
      setNoReviewsYet(true);
    } else if (getItemLikesStatus === status.finish && itemLikes.total === 0) {
      setNoReviewsYet(true);
    } else {
      setNoReviewsYet(false);
    }
  }, [getItemLikesStatus, itemLikes]);

  return (
    <React.Fragment>
      {getItemLikesStatus === status.loading && (
        <Grid item className={classes.loader}>
          <LinearProgress />
        </Grid>
      )}

      {noReviewsYet && (
        <Grid item className={classes.noReviewsItem}>
          <Typography
            variant="body2"
            align="center"
            className={classes.noReviewsStyle}
          >
            No reviews yet
          </Typography>
        </Grid>
      )}

      {getItemLikesStatus === status.finish && itemLikes.total > 0 && (
        <Grid
          container
          item
          direction="row"
          justify="space-between"
          alignItems="center"
          alignContent="flex-start"
          className={classes.reviewsContainer}
        >
          <Grid
            container
            item
            xs={7}
            lg={5}
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Button size="small" className={classes.likeButton}>
                <ThumbUpOutlinedIcon className={classes.thumbsUp} />
                <Typography variant="subtitle2">{itemLikes.Likes}</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button size="small" className={classes.likeButton}>
                <ThumbsUpDownOutlinedIcon className={classes.thumbsUpDown} />
                <Typography variant="subtitle2">
                  {itemLikes.Indifferent}
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button size="small" className={classes.likeButton}>
                <ThumbDownOutlinedIcon className={classes.thumbsDown} />
                <Typography variant="subtitle2">
                  {itemLikes.DisLikes}
                </Typography>
              </Button>
            </Grid>
          </Grid>

          <Grid item className={classes.readReviewsGridItem}>
            <Button
              variant="outlined"
              size="small"
              disabled={addToBasketStatus === status.loading}
              component={Link}
              to="/reviews"
            >
              read reviews
            </Button>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsSummary);
