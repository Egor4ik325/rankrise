const routes = {
  home: "/",
  login: "/login",
  search: "/search",
  notFound: "/404",
  questions: "/questions",
  product: (id) => `/products/${id}`,
};

export default routes;
