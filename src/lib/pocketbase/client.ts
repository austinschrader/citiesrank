import { getApiUrl } from "@/config/appConfig";
import PocketBase from "pocketbase";

const apiUrl = getApiUrl();
export const client = new PocketBase(apiUrl);
