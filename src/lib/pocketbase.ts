import PocketBase from 'pocketbase';

const apiUrl = import.meta.env.VITE_ENV === 'production' 
  ? import.meta.env.VITE_API_URL_PRODUCTION 
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

export const pb = new PocketBase(apiUrl);