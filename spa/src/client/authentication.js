import { Resource } from "./resources";
import {
  handleResponseError,
  LoginError,
  NotAuthenticatedError,
  OtherError,
  ServerError,
} from "./errors";
import { reverse } from "./urls";
import { User } from "./models";

export default class Authentication extends Resource {
  // Login
  async login({ username, password }) {
    try {
      const response = await this._request({
        method: "post",
        url: reverse("login"),
        data: { username, password },
      });

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);
    } catch (error) {
      // Any non-2xx response statues should go there

      // Error can be due to the user input
      if (error.response) {
        if (error.response.status === 400) {
          throw new LoginError(error.response.data);
        }
        if (error.response.status === 500) {
          throw new ServerError();
        }

        throw new OtherError();
      }

      throw error;
    }
  }

  async getUser() {
    try {
      const response = await this._request({ url: reverse("user") });
      return new User(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new NotAuthenticatedError();
        }

        handleResponseError(error.response);
      }

      throw error;
    }
  }
}
