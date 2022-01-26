import axios from "axios";
import _ from "lodash";

import { apiServerBaseUrl, reverse } from "./urls";
import {
  DoesNotExistsError,
  handleResponseError,
  InvalidDataError,
} from "./errors";
import { Question, QuestionsResponse } from "./models";

// Resource represents an interface to some part of API
export class Resource {
  constructor({
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
  }) {
    this.getAccessToken = getAccessToken;
    this.setAccessToken = setAccessToken;
    this.removeAccessToken = removeAccessToken;
    this.getRefreshToken = getRefreshToken;
    this.setRefreshToken = setRefreshToken;
    this.removeRefreshToken = removeRefreshToken;

    // Base API url/origin
    this._client = axios.create({
      baseURL: apiServerBaseUrl,
    });
  }

  async _request(config) {
    // token property can be changed after authentication => check on every request
    const token = this.getAccessToken();
    if (token) {
      _.set(config, "headers.Authorization", `Bearer ${this.token}`);
    }

    try {
      return await this._client.request(config);
    } catch (error) {
      // Exceptions are handled by specific resource classes
      throw error;
    }
  }
}

// Utility resource for validating, verifying and refreshing tokens
export class Tokens extends Resource {
  async verifyAccessToken() {
    try {
      this._client.post({
        method: "post",
        url: reverse("tokenVerify"),
        data: { token: this.getAccessToken() },
      });
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 400) {
          return false;
        }

        handleResponseError(error.response);
      }

      throw error;
    }
  }

  async renewAccessToken() {
    try {
      const response = await this._client.post({
        method: "post",
        url: reverse("tokenRefresh"),
        data: { refresh: this.getRefreshToken() },
      });

      const accessToken = response.data.access;
      this.setAccessToken(accessToken);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }
}

export class Questions extends Resource {
  // Page should be 0 if user passes undefined or {}
  async list({ page = 0 } = { page: 0 }) {
    try {
      const response = await this._request({
        url: reverse("questionList"),
        params: { p: page },
      });

      return new QuestionsResponse(response.data);
    } catch (error) {
      // Error doesn't depend on user input
      throw error;
    }
  }

  async retrieve({ id }) {
    try {
      const response = await this._request({
        url: reverse("questionDetail", { id }),
      });

      return new Question(response.data);
    } catch (error) {
      // the object may not exists but the user don't have direct access to pass arbitrary id (user can only choose)
      // if server responded with bad status code
      if (error.response) {
        // error.response.status should equal 404
        throw new DoesNotExistsError();
      }

      throw error;
    }
  }

  async create({ title }) {
    try {
      const response = await self._request({
        method: "post",
        url: reverse("questionList"),
        data: { title },
      });
      return new Question(response.data);
    } catch (error) {
      // User invalid data
      if (error.response) {
        throw new InvalidDataError(error.response.data);
      }
      throw error;
    }
  }
}

export class Options extends Resource {
  list() {}

  retrieve() {}
}
