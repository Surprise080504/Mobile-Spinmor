import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

import { makeStyles } from "@material-ui/core/styles";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";

const useStyles = makeStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const mapStateToProps = ({ BasketReducer }) => ({
  totalItems: BasketReducer.basketItems.length,
  totalQty: BasketReducer.totalQty,
});
const mapDispatchToProps = (dispatch) => ({});

function BasketSummaryLink({ totalItems, totalQty }) {
  const classes = useStyles();

  return (
    <IconButton color="inherit">
      <Badge
        badgeContent={totalQty}
        color="primary"
        classes={{ badge: classes.badge }}
        showZero
      >
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}

BasketSummaryLink.propTypes = {
  totalQty: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(BasketSummaryLink);
