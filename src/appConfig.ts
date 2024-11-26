export const config = {
  api: {
    development: 'http://127.0.0.1:8090',
    pre: 'https://citiesrank-ppe.westus2.cloudapp.azure.com',
    production: 'https://api.citiesrank.com'
  }
};

export const getApiUrl = (env: string): string => {
  return config.api[env as keyof typeof config.api] || config.api.development;
};
