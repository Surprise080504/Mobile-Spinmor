import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from "@material-ui/icons/Check";

import { setCurrency } from "../../Redux/AppReducer/App.act";

import { currencies } from "../../Assets/currencies";

const useStyles = makeStyles((theme) => ({
  button: {
    "& .MuiButton-endIcon": {
      marginLeft: 0,
    },
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  direction: AppReducer.direction,
  currency: AppReducer.currency,
});
const mapDispatchToProps = (dispatch) => ({
  setCurrency: bindActionCreators(setCurrency, dispatch),
});

function CurrencyMenu({ currency, direction, setCurrency }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        variant="text"
        endIcon={<ExpandMoreIcon />}
        aria-label="change currency"
        aria-haspopup="true"
        aria-controls="currency-menu"
        onClick={handleMenuClick}
        color="inherit"
        className={classes.button}
      >
        {currency.iso}
      </Button>

      <Menu
        id="currency-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <div dir={direction}>
          {currencies.map((currCurrency) => (
            <MenuItem
              key={currCurrency.iso}
              onClick={() => setCurrency(currCurrency)}
            >
              <CheckIcon
                style={{
                  visibility: currCurrency.iso === currency.iso ? "" : "hidden",
                  marginRight: 4,
                }}
              />
              {currCurrency.iso}
            </MenuItem>
          ))}
        </div>
      </Menu>
    </React.Fragment>
  );
}

CurrencyMenu.propTypes = {
  currency: PropTypes.shape({
    name: PropTypes.string,
    iso: PropTypes.string,
    symbol: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyMenu);
