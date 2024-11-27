var env = import.meta.env.VITE_ENV || "dev";
export var appConfig = {
    api: {
        dev: "http://127.0.0.1:8090",
        pre: "https://citiesrank-ppe.westus2.cloudapp.azure.com",
        prod: "https://api.citiesrank.com",
    },
};
export var getApiUrl = function () {
    return appConfig.api[env];
};
