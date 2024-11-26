export var config = {
    api: {
        development: 'http://127.0.0.1:8090',
        pre: 'https://citiesrank-ppe.westus2.cloudapp.azure.com',
        production: 'https://api.citiesrank.com'
    }
};
export var getApiUrl = function (env) {
    return config.api[env] || config.api.development;
};
