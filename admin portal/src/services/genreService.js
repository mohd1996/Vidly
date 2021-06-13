import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/genres";
export async function getGenres() {
  return http.get(apiEndPoint);
}
