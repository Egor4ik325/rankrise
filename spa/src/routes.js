const routes = {
  home: "/",
  login: "/login",
  search: "/search",
  notFound: "/404",
  questions: "/questions",
  productAdd: "/products/add",
  product: (id) => `/products/${id}`,
};

export default routes;
