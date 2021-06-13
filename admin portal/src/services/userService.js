import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/users";

export function register(user) {
  try {
    return http.post(apiEndPoint, {
      email: user.username,
      password: user.password,
      name: user.name
    });
  } catch (error) {
    if (error.response && error.response.status === 400) return;
  }
}


