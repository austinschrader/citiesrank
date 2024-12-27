import PocketBase from "pocketbase";
import { getApiUrl } from "@/config/appConfig";

const apiUrl = getApiUrl();
export const pb = new PocketBase(apiUrl);
