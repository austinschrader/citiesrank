const env = import.meta.env.VITE_ENV || "dev";

type Env = "dev" | "pre" | "prod";

export const appConfig = {
  api: {
    dev: "http://127.0.0.1:8090",
    pre: "https://citiesrank-ppe.westus2.cloudapp.azure.com",
    prod: "https://api.citiesrank.com",
  },
};

export const getApiUrl = () => {
  return appConfig.api[env as Env];
};
