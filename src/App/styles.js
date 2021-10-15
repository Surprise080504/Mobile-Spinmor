import teal from "@material-ui/core/colors/teal";
import purple from "@material-ui/core/colors/purple";

export const defaultTheme = {
  root: {
    flexGrow: 1,
  },
  direction: "ltr",
  palette: {
    type: "light",
    primary: teal,
    secondary: purple,
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
};

export const AppStyles = (theme) => ({
  containerPadding: {
    [theme.breakpoints.down("xl")]: {
      padding: 0,
    },
  },
});
