import React from "react";
// import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { status } from "../../api/api";
import { setNewCardForm } from "../../Redux/PaymentReducer/Payment.act";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    marginTop: theme.spacing(1),
    marginLeft: 2,
  },

  selectStyle: {
    width: 85,
  },
  cvcStyle: {
    width: 101,
  },
}));

const mapStateToProps = ({ PaymentReducer }) => ({
  newCardForm: PaymentReducer.newCardForm,

  payCardStatus: PaymentReducer.payCardStatus,
  processOrderStatus: PaymentReducer.processOrderStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setNewCardForm: bindActionCreators(setNewCardForm, dispatch),
});

function AddCreditCard({
  setNewCardForm,
  newCardForm,

  payCardStatus,
  processOrderStatus,
}) {
  const classes = useStyles();

  const yearOptions = React.useMemo(() => {
    const years = [];

    for (let i = 2021; i <= 2035; i++) {
      years.push(i);
    }
    return years;
  }, []);

  //
  //initialize year & month on mount
  React.useEffect(() => {
    setNewCardForm("Month", 1);
    setNewCardForm("Year", yearOptions[0]);
  }, [setNewCardForm, yearOptions]);

  //
  //
  const onAnyChange = (e, fieldName) => {
    let value = "";

    if (fieldName === "SaveCardDetails") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    setNewCardForm(fieldName, value);
  };

  return (
    <form autoComplete="on">
      <Grid
        container
        item
        direction="column"
        className={classes.rootContainer}
        spacing={2}
      >
        <Grid item>
          <TextField
            variant="filled"
            label="Name on card"
            inputProps={{ autoComplete: "cc-number" }}
            value={newCardForm.NameOnCard}
            onChange={(e) => onAnyChange(e, "NameOnCard")}
          />
        </Grid>

        <Grid item>
          <TextField
            variant="filled"
            label="Card number"
            inputProps={{ autoComplete: "cc-number" }}
            value={newCardForm.CardNumber}
            onChange={(e) => onAnyChange(e, "CardNumber")}
          />
        </Grid>

        <Grid container item direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <FormControl variant="filled">
              <InputLabel id="select-month-label">Month</InputLabel>
              <Select
                labelId="select-month-label"
                id="select-month"
                label="Month"
                inputProps={{
                  autoComplete: "cc-exp-month",
                }}
                className={classes.selectStyle}
                value={newCardForm.Month}
                onChange={(e) => onAnyChange(e, "Month")}
              >
                <MenuItem value={1}>01</MenuItem>
                <MenuItem value={2}>02</MenuItem>
                <MenuItem value={3}>03</MenuItem>
                <MenuItem value={4}>04</MenuItem>
                <MenuItem value={5}>05</MenuItem>
                <MenuItem value={6}>06</MenuItem>
                <MenuItem value={7}>07</MenuItem>
                <MenuItem value={8}>08</MenuItem>
                <MenuItem value={9}>09</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl variant="filled">
              <InputLabel id="select-year-label">Year</InputLabel>
              <Select
                labelId="select-year-label"
                id="select-year"
                label="Year"
                inputProps={{
                  autoComplete: "cc-exp-year",
                }}
                className={classes.selectStyle}
                value={newCardForm.Year}
                onChange={(e) => onAnyChange(e, "Year")}
              >
                {yearOptions.map((y) => (
                  <MenuItem kay={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item className={classes.cvcStyle}>
          <TextField
            variant="filled"
            label="cvc"
            inputProps={{ autoComplete: "cc-csc" }}
            value={newCardForm.CVC}
            onChange={(e) => onAnyChange(e, "CVC")}
          />
        </Grid>

        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                disabled={
                  payCardStatus === status.loading ||
                  processOrderStatus === status.loading
                }
                checked={newCardForm.SaveCardDetails}
                onChange={(e) => onAnyChange(e, "SaveCardDetails")}
              />
            }
            label={
              <Typography variant="body2">
                Tokenize and store card details in highly secured PCI DSS
                complaint database
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCreditCard);
