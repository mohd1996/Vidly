import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";

const apiEndPoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login({ username, password }) {
  try {
    const { data: jwt } = await http.post(apiEndPoint, {
      email: username,
      password: password
    });
    localStorage.setItem(tokenKey, jwt);
  } catch (error) {
    if (error.response && error.response.status === 400) return;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}
export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
