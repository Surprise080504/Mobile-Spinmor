import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link, useLocation } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Box from '@material-ui/core/Box';
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { logout, setIsMenuOpen } from "../../Redux/AppReducer/App.act";
import { drawerWidth } from "../../Assets/consts";
import CurrencyMenu from "../Basket/CurrencyMenu";
import spinmorLogo from "../../Assets/images/logo.jpeg";
import basketIcon from "../../Assets/icons/basket.gif";
import rewardsIcon from "../../Assets/icons/Rewards.gif";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },

  spinmorTitle: {
    padding: theme.spacing(1),
    boxSizing: "border-box",
    // maxHeight: 56,
    justifyContent: "space-between",
  },

  menuItemColor: {
    color: "black",
    paddingLeft: theme.spacing(1),
    "& .MuiListItemIcon-root": {
      color: "black",
    },
  },
  menuActiveItemColor: {
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      fontWeight: 600,
    },
  },
}));

const mapStateToProps = ({ AppReducer, ScannerReducer, BasketReducer }) => ({
  isMenuOpen: AppReducer.isMenuOpen,
  firstName: AppReducer.firstName,
  direction: AppReducer.direction,
  qrItem: ScannerReducer.qrItem,
  basketItems: BasketReducer.basketItems,
  basketDbData: BasketReducer.basketDbData
});
const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(logout, dispatch),
  setIsMenuOpen: bindActionCreators(setIsMenuOpen, dispatch),
});
function AppBarNav({
  isMenuOpen,
  setIsMenuOpen,
  logout,
  firstName,
  direction,
  qrItem,
  basketItems,
  basketDbData
}) {
  const classes = useStyles();

  const location = useLocation();

  const handleDrawerOpen = () => {
    setIsMenuOpen(true);
  };
  const handleDrawerClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, isMenuOpen && classes.appBarShift)}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, isMenuOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          {qrItem ? (<img loading="lazy" src={rewardsIcon} width={40} height={40} />) : (<Typography variant="h6" noWrap>
            G'day {firstName}
          </Typography>)}

          {basketDbData.basketStatus === "e" && (<Box component="span" m={1}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 30, color: "#e60000" }}>
              <img loading="lazy" src={basketIcon} width={30} height={30} />
              <Typography style={{ fontWeight: 550 }} variant="h5">{basketItems.length}</Typography>
            </div>
          </Box>)}
          <div style={{ flexGrow: 1 }} />
          <CurrencyMenu />
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        // anchor="left"
        open={isMenuOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img
            src={spinmorLogo}
            alt="logo"
            width={drawerWidth - 80}
          // height={48}
          />

          <IconButton onClick={handleDrawerClose}>
            {direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>

        <Divider />

        <List>
          <ListItem
            button
            component={Link}
            to="/"
            className={
              location.pathname === "/"
                ? classes.menuActiveItemColor
                : classes.menuItemColor
            }
            onClick={handleDrawerClose}
          >
            {/*<ListItemIcon>
              <CameraAltIcon />
            </ListItemIcon>*/}
            <ListItemText primary="Scan QR" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/basket"
            className={
              location.pathname === "/basket"
                ? classes.menuActiveItemColor
                : classes.menuItemColor
            }
            onClick={handleDrawerClose}
          >
            {/*<ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>*/}
            <ListItemText primary="Basket" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/orders"
            className={
              location.pathname === "/orders"
                ? classes.menuActiveItemColor
                : classes.menuItemColor
            }
            onClick={handleDrawerClose}
          >
            {/*<ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>*/}
            <ListItemText primary="Orders" />
          </ListItem>

          {/*<ListItem
            button
            component={Link}
            to="/profile"
            className={
              location.pathname === "/profile"
                ? classes.menuActiveItemColor
                : classes.menuItemColor
            }
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>}
            <ListItemText primary="Profile" />
          </ListItem>*/}
        </List>

        <Divider />
        <List>
          {/*<ListItem button className={classes.menuItemColor}>
            <ListItemIcon>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText primary="Change Language" />
          </ListItem>*/}

          {/*<ListItem button className={classes.menuItemColor}>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Contact Us" />
          </ListItem>*/}

          <ListItem
            button
            onClick={handleLogout}
            className={classes.menuItemColor}
          >
            {/*<ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>*/}
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}

AppBarNav.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppBarNav);
