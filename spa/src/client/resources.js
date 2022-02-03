import axios from "axios";
import _ from "lodash";

import { apiServerBaseUrl, reverse } from "./urls";
import {
  DoesNotExistsError,
  handleResponseError,
  InvalidDataError,
} from "./errors";
import {
  Question,
  QuestionsResponse,
  OptionsModel,
  Product,
  ProductImage,
  Products as ProductsModel,
  Vote,
} from "./models";

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
    let token = this.getAccessToken();
    if (token) {
      _.set(config, "headers.Authorization", `Bearer ${token}`);
    }

    try {
      return await this._client.request(config);
    } catch (error) {
      // Validating, verifying and refreshing tokens (token auto renewal)
      if (error?.response?.data?.code === "token_not_valid") {
        if (this.getRefreshToken()) {
          this.removeAccessToken();
          try {
            await this._renewAccessToken();

            // Replace old token with new
            token = this.getAccessToken();
            if (token) {
              _.set(config, "headers.Authorization", `Bearer ${token}`);
            } else {
              // Delete property or null (if not set)
              delete config?.headers?.Authorization;
            }

            return await this._client.request(config);
          } catch (error) {
            // If the refresh token has expired that user is have to login again
            if (error?.response?.data?.code === "token_not_valid") {
              this._clearTokens();
            }
          }
        } else {
          this._clearTokens();
        }
      }

      // Exceptions are handled by specific resource classes
      throw error;
    }
  }

  _clearTokens() {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  async _renewAccessToken() {
    try {
      // Authorization header free request
      const response = await this._client.post(reverse("tokenRefresh"), {
        refresh: this.getRefreshToken(),
      });

      const accessToken = response.data.access;
      this.setAccessToken(accessToken);
    } catch (error) {
      throw error;
    }
  }
}

export class Questions extends Resource {
  // Page should be 0 if user passes undefined or {}
  async list({ page = 1, page_size = 5 } = { page: 1, page_size: 5 }) {
    try {
      const response = await this._request({
        url: reverse("questionList"),
        params: { page, page_size },
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
      const response = await this._request({
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

  async search({ query, page = 1, page_size = 5 }) {
    try {
      const response = await this._request({
        url: reverse("questionList"),
        params: { search: query, page, page_size },
      });

      return new QuestionsResponse(response.data);
    } catch (error) {
      // If API error handle as API error (convert status to error class/object)
      if (error.response) {
        handleResponseError(error.response);
      }
      // Don't handle non-API errors
      throw error;
    }
  }
}

export class Options extends Resource {
  async list({ questionId }) {
    try {
      const response = await this._request({
        url: reverse("optionList", { questionPk: questionId }),
      });

      return new OptionsModel(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  retrieve() {}

  async create({ questionId, productId }) {
    try {
      await this._request({
        method: "post",
        url: reverse("optionList", { questionPk: questionId }),
        data: { product: productId },
      });
    } catch (error) {
      // If API error raise API error
      if (error.response) {
        handleResponseError(error.response);
      }

      // Otherwise don't handle error (reraise)
      throw error;
    }
  }
}

export class Products extends Resource {
  async retrieve({ id }) {
    try {
      const response = await this._request({
        url: reverse("productDetail", { id }),
      });

      return new Product(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  async search({ query, page = 1 }) {
    try {
      const response = await this._request({
        url: reverse("productList"),
        params: { search: query, page },
      });

      return new ProductsModel(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  async create({ name, description, website, price }) {
    try {
      const data = {};
      if (name) {
        data.name = name;
      }
      if (description) {
        data.description = description;
      }
      if (website) {
        data.website = website;
      }
      if (price) {
        data.price = price;
      }
      const response = await this._request({
        method: "post",
        url: reverse("productList"),
        data,
      });

      return new Product(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }
}

export class ProductImages extends Resource {
  async retrieve({ id }) {
    try {
      const response = await this._request({
        url: reverse("productImageDetail", { id }),
      });

      return new ProductImage(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  async upload({ productId, image }) {
    // Construct form-data from image blob and product id
    const formData = new FormData();
    formData.append("product", productId);
    formData.append("image", image);

    try {
      const response = await this._request({
        method: "post",
        url: reverse("productImageList"),
        data: formData,
        headers: { "content-type": "multipart/form-data" },
      });

      return new ProductImage(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }
}

export class Votes extends Resource {
  // Vote for some option
  async create({ questionId, optionId, up }) {
    try {
      const response = await this._request({
        method: "post",
        url: reverse("voteList", {
          questionPk: questionId,
          optionPk: optionId,
        }),
        data: { up },
      });

      return new Vote(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  // List user's votes for particular option
  async list({ questionId, optionId }) {
    try {
      const response = await this._request({
        url: reverse("voteList", {
          questionPk: questionId,
          optionPk: optionId,
        }),
      });

      return response.data.map((vote) => new Vote(vote));
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  // Unvote for some option
  async delete({ questionId, optionId, voteId }) {
    try {
      await this._request({
        url: reverse("voteDetail", {
          method: "delete",
          questionPk: questionId,
          optionPk: optionId,
          id: voteId,
        }),
      });
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }

  async update({ questionId, optionId, voteId, up, experience = null }) {
    try {
      const response = await this._request({
        method: "patch",
        url: reverse("voteDetail", {
          questionPk: questionId,
          optionPk: optionId,
          id: voteId,
        }),
        data: _.assign({ up }, experience && { experience }),
        // or
        // data: { up, ...experience && { experience }}
      });

      return new Vote(response.data);
    } catch (error) {
      if (error.response) {
        handleResponseError(error.response);
      }

      throw error;
    }
  }
}
