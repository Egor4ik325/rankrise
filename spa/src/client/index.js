import APIClient from "./client";

// Inject token dependency from interface part (dependency injection)
// because the token can change at runtime we should provide dynamic way for API to managing it
// settings/dependency injection is preferred over changing api.token property
const ACCESS_TOKEN_LOCAL_STORAGE_KEY_NAME = "accessToken";
const REFRESH_TOKEN_LOCAL_STORAGE_KEY_NAME = "refreshToken";

const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY_NAME);
const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY_NAME, token);
const removeAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY_NAME);
const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY_NAME);
const setRefreshToken = (token) =>
  localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY_NAME, token);
const removeRefreshToken = () =>
  localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY_NAME);

// The client will both do:
// 1. interaction with the server (endpoints, deserialization, error handling)
// 2. session management on the client-side (access, refresh tokens in local storage)

const api = new APIClient({
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  setAccessToken,
  setRefreshToken,
  removeRefreshToken,
});
export default api;
