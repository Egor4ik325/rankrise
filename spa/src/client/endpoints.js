export const apiServerBaseUrl = "http://localhost/api/";

const endpoints = {
  login: () => `auth/login/`,
  tokenVerify: () => `auth/token/verify/`,
  tokenRefresh: () => `auth/token/refresh/`,
  questionList: () => `questions/`,
  questionDetail: ({ id }) => `questions/${id}/`,
  productList: () => `products/`,
  productDetail: ({ slug }) => `products/${slug}/`,
  productImageList: () => `products/images/`,
  productImageDetail: ({ id }) => `products/images/${id}/`,
  optionList: ({ questionPk }) => `questions/${questionPk}/options/`,
  optionDetail: ({ questionPk, id }) =>
    `questions/${questionPk}/options/${id}/`,
  voteList: ({ questionPk, optionPk }) =>
    `questions/${questionPk}/options/${optionPk}/votes/`,
  voteDetail: ({ questionPk, optionPk, id }) =>
    `questions/${questionPk}/options/${optionPk}/votes/${id}/`,
  categoryList: () => `categories/`,
  categoryDetail: ({ id }) => `categories/${id}/`,
};

export const reverse = (name, args) => {
  const url = endpoints[name](args);
  return `${apiServerBaseUrl}${url}`;
};
