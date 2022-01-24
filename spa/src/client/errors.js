/*
Errors/exceptions are based on API response's status code: 4xx, 5xx.

- some endpoints provide feedback (response detail) (e.g. validated user data, what is invalid)
*/

export class LoginError {
  constructor(data) {
    this.message =
      "Error occurred while trying to login using provided credentials.";
    this.name = "LoginError";

    this.data = data;
  }
}

export class DoesNotExistsError {
  constructor() {
    this.message =
      "Error occurred while trying to retrieve an object that doesn't exists.";
    this.name = "DoesNotExistsError";
  }
}

export class InvalidDataError {
  constructor(data) {
    this.message = "Error occurred due to initial data is invalid.";
    this.name = "InvalidDataError";
    this.data = data;
  }
}
