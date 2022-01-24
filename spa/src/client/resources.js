import axios from "axios";
import _ from "lodash";

import { apiServerBaseUrl, reverse } from "./endpoints";
import { DoesNotExistsError, InvalidDataError } from "./errors";
import { Question, QuestionsResponse } from "./models";

// Resource represents an interface to some part of API
export class Resource {
  constructor(getToken) {
    this.getToken = getToken;
    // this.token = token;
    // Base API url/origin
    this._client = axios.create({
      baseURL: apiServerBaseUrl,
    });
  }

  async _request(config) {
    // token property can be changed after authentication => check on every request
    const token = this.getToken();
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
