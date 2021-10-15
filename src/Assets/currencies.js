import { evaluate } from "mathjs";

export function exchangeFormat(data) {
  // console.log(data);
  const {
    localPrice,
    fromCurrency,
    toCurrency,
    exchangeRate,
    pieces = 1,
    withSymbol = true,
    withIso = false,
  } = data;

  const locationExchangeRate = exchangeRate[fromCurrency.trim()];
  const userExchangeRate = exchangeRate[toCurrency.trim()];

  if (
    isNaN(parseFloat(localPrice)) ||
    isNaN(parseFloat(locationExchangeRate)) ||
    isNaN(parseFloat(userExchangeRate)) ||
    isNaN(parseFloat(pieces))
  ) {
    return "??.??";
  }

  const res = {
    float: 0.0,
    precised: "",
    string: "",
  };

  const numberRes = evaluate(
    `(${localPrice} / ${locationExchangeRate}) * ${userExchangeRate} * ${pieces}`
  );
  res.float = numberRes;

  const precised = numberRes.toFixed(2);
  res.precised = precised;

  const splitted = precised.toString().split(".");

  // const CurrencyDecimalDC = "a";
  // const CurrencySymbolLR = "l";
  // const currencySymbol = getCurrencyFromIsoOrSymbol(toCurrency).symbol;
  const currencyInfo = getCurrencyFromIsoOrSymbol(toCurrency);
  const currencySymbol = currencyInfo.symbol;
  const decimalSeparator = currencyInfo.decimalSeparator;
  const thousandsSeparator = currencyInfo.thousandsSeparator;
  const symbolPosition = currencyInfo.symbolPosition;

  // console.log(splitted);

  // let decimalSeparator = "";
  // let thousandsSeparator = "";
  // if (CurrencyDecimalDC === "c") {
  //   decimalSeparator = ",";
  //   thousandsSeparator = ".";
  // } else {
  //   decimalSeparator = ".";
  //   thousandsSeparator = ",";
  // }

  const leftSide = splitted[0].split("").reverse().join("");
  let formattedLeftSide = "";
  for (let i = 0; i < leftSide.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedLeftSide += thousandsSeparator;
    }
    formattedLeftSide += leftSide[i];
  }
  formattedLeftSide = formattedLeftSide.split("").reverse().join("");

  let formatted = formattedLeftSide + decimalSeparator + splitted[1];
  // console.log(formatted);

  if (withSymbol) {
    if (symbolPosition === "left") {
      formatted = currencySymbol + formatted;
      if (withIso) {
        formatted += currencyInfo.iso;
      }
    } else {
      formatted += currencySymbol;
      if (withIso) {
        formatted = currencyInfo.iso + formatted;
      }
    }
  }

  // console.log(formatted);
  res.formatted = formatted;

  return res.formatted;
}

export function getCurrencyFromIsoOrSymbol(isoOrSymbol, options = {}) {
  const { returnNull = false, ignoreNullish = true } = options;

  const defaultCurrency = { ...currencies[0] };

  if (ignoreNullish && !isoOrSymbol) {
    if (returnNull) {
      return null;
    } else {
      return defaultCurrency;
    }
  }

  for (let i = 0; i < currencies.length; i++) {
    if (
      currencies[i].iso === isoOrSymbol?.trim() ||
      currencies[i].symbol === isoOrSymbol?.trim()
    ) {
      return { ...currencies[i] };
    }
  }

  if (returnNull) {
    return null;
  }
  return defaultCurrency;
}

export const currencies = [
  {
    name: "Australian Dollar",
    iso: "AUD",
    // symbol: "AUD",
    symbol: "$",
    thousandsSeparator: ",",
    decimalSeparator: ".",
    symbolPosition: "left",
  },
  {
    name: "United States Dollar",
    iso: "USD",
    // symbol: "USD",
    symbol: "$",
    thousandsSeparator: ",",
    decimalSeparator: ".",
    symbolPosition: "left",
  },
  {
    name: "Canadian Dollar",
    iso: "CAD",
    // symbol: "CAD",
    symbol: "$",
    thousandsSeparator: ",",
    decimalSeparator: ".",
    symbolPosition: "left",
  },
  {
    name: "Euro",
    iso: "EUR",
    symbol: "€",
    thousandsSeparator: ".",
    decimalSeparator: ",",
    symbolPosition: "right",
  },
  {
    name: "Great Britain Pound",
    iso: "GBP",
    symbol: "£",
    thousandsSeparator: ",",
    decimalSeparator: ".",
    symbolPosition: "left",
  },
];
