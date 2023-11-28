import axios from "axios";

const getApiInstance = () => {
  if (process.env.NODE_ENV === "development") {
    return axios.create({
      baseURL: "http://localhost:1412",
    });
  } else {
    return axios.create({
      baseURL: "repositoriotccapi.flashnetriopreto.com.br",
    });
  }
};

export const api = getApiInstance();
