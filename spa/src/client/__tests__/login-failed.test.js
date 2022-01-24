import api from "..";
import { LoginError } from "../errors";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    request: () => {
      let err = new Error("Request failed with 401");
      // Error is associated with initial request
      err.response = {
        data: {
          detail: "Invalid credentials",
        },
      };

      throw err;
    },
  })),
}));

it("logins with invalid credentials", async () => {
  let error;
  try {
    await api.authentication.login({
      username: "invalid",
      password: "credentials",
    });
  } catch (err) {
    error = err;
  }

  expect(error instanceof LoginError).toBe(true);
  expect(error.data.detail).toBe("Invalid credentials");
});
