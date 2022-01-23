// Integration test

import api from "..";

// Example API response fake data
const data = {
  access_token:
    "eyJ0iJIUzI1NiJ9.eyJ0b2tlbl90eXBlI6Ijg4OTJiNWI3I6MX0.acSTIYuVf1y7PE82846s",
  refresh_token:
    "eyJ0eXiJIUzI1NiJ9.eyJ0b2taWQiOjF9.cpehIM_1R9tYgr-gePO89982398239898rw",
};

// Mock the axios module (with module factory and mocked/spy implementation function)
jest.mock("axios", () => ({
  create: () => ({
    request: () => {
      // Mocked axios response
      const resp = {
        data,
        status: 200,
        statusText: "OK",
      };
      return resp;
    },
  }),
}));

test("api client login doesn't return error", async () => {
  const response = await api.authentication.login({
    username: "mock",
    password: "mock",
  });
  expect(response.accessToken).toBe(data.access_token);
});
