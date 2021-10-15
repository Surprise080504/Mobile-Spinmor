export const drawerWidth = 240;
export const defaultScanDelay = 1000;

export const operatorAppTitle = "Operator web platform";

const devHost_operator = "http://localhost:4001";
const prodHost_operator = "https://spinmor.azurewebsites.net";
export const operatorAppHost =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? devHost_operator
    : prodHost_operator;
