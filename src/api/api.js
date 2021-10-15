import axios from "axios";

export let axiosInstance = axios.create({
  baseURL: "https://spinmor1.azurewebsites.net",
});

export const status = {
  finish: "finish",
  not_started: "not started",
  loading: "loading",
  error: "error",

  success_exchange: "success exchange",
  error_exchange: "error exchange",

  success_login: "success login",
  error_login: "error login",
};
