import { Resource } from "./resources";
import { LoginError } from "./errors";
import { reverse } from "./endpoints";
import { LoginResponse } from "./models";

export default class Authentication extends Resource {
  // Login
  async login({ username, password }) {
    try {
      const response = await this._request({
        url: reverse("login"),
        data: { username, password },
      });

      return new LoginResponse(response.data);
    } catch (error) {
      // Error can be due to the user input
      if (error.response) {
        throw new LoginError(error.response.data);
      }

      throw error;
    }
  }
}
