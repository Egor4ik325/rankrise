import APIClient from "./client";

// Inject get token lambda dependency from interface part (dependency injection)
// because the token can change at runtime we should provide dynamic way of getting it
// lambda is preferred over changing api.token property
const getToken = () => localStorage.getItem("token");

const api = new APIClient({ getToken });
export default api;
