import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import {
  MuiThemeProvider,
  createMuiTheme,
  StylesProvider,
  jssPreset,
  responsiveFontSizes,
  makeStyles,
} from "@material-ui/core/styles";

import { create } from "jss";
import rtl from "jss-rtl";

import { defaultTheme } from "./styles";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    // boxSizing: "border-box",
  },
  mainPaper: {
    // height: "100%",
    // width: "100%",
  },
}));

const mapStateToProps = ({ AppReducer }) => ({
  themeType: AppReducer.themeType,
  direction: AppReducer.direction,
});
const mapDispatchToProps = () => ({});

const AppTheme = ({ themeType, direction, children }) => {
  const classes = useStyles();

  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider
        theme={responsiveFontSizes(
          createMuiTheme({
            ...defaultTheme,
            direction,
            palette: {
              ...defaultTheme.palette,
              type: themeType,
              background: {
                // paper: themeType === "light" ? "#efebe9" : "#121212", //off white color for light theme
                paper: themeType === "light" ? "#fff" : "#121212",
              },
            },
            scannerWidth: 600,
          })
        )}
      >
        <div dir={direction}>
          <Container
            maxWidth="xl"
            className={classes.container}
            component={Paper}
          >
            {children}
          </Container>
        </div>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

AppTheme.propTypes = {
  //connected
  themeType: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  //passed
  children: PropTypes.element,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppTheme);
