import axios from "axios";

import { apiServerBaseUrl } from "./endpoints";

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

  _request(config) {
    let headers = {};

    // token property can be changed after authentication => check on every request
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      return this._client.request({ ...config, headers: headers });
    } catch (error) {
      throw error;
    }
  }
}

export class Questions extends Resource {
  list() {}

  retrieve() {}
}

export class Options extends Resource {
  list() {}

  retrieve() {}
}
