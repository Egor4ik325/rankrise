/*
Errors/exceptions are based on API response's status code:

1. Client error
2. Server error

- 400 - should provide user with dynamic feedback/response from API [possibility]
- 401, 403, 404 - user not authenticated (frontend must prevent such actions directly)
- 405 - API client library error
- 500 - server error (display to the user that user is down) [possibility]

- some endpoints provide feedback (response detail) (e.g. validated user data, what is invalid)
*/

// Any kind of error related to API (when axios throws an error with response property)
// used to check whether the error has come from API or from any where else (syntax error)
export class APIError extends Error {}

// Same as BadRequestError (login error or signup error can be determined based on general bad request error by context)
export class LoginError extends APIError {
  constructor() {
    super("Error occurred while trying to login using provided credentials.");
    this.name = "LoginError";
  }
}

export class DoesNotExistsError extends APIError {
  constructor() {
    super(
      "Error occurred while trying to retrieve an object that doesn't exists."
    );
    this.name = "DoesNotExistsError";
  }
}

export class InvalidDataError extends APIError {
  constructor(data) {
    super("Error occurred due to initial request data is invalid.");
    this.name = "InvalidDataError";
    this.data = data;
  }
}

export class ServerError extends APIError {
  constructor() {
    super("Error happened on the server-side of application.");
    this.name = "ServerError";
  }
}

// Any other API error that should not happen (it is just used for debugging to provide the developer with extra information about what has happened)
// or just `APIError`
// NOTE: these errors should only be displayed in when running app in debug mode
export class OtherError extends APIError {
  constructor(response) {
    if (response?.data?.detail) {
      super(`${response.status}: ${response.data.detail}`);
    } else {
      super(`${response.status}: Error occurred while doing this action`);
    }
    this.name = "OtherError";
  }
}

// Generic error handler (response status dispatcher)

// Handle all other responses with appropriate API errors (boilerplate handling)
export const handleResponseError = (response) => {
  if (response.status >= 500 && response.status < 600) {
    throw new ServerError();
  }

  throw new OtherError(response);
};

export class NotAuthenticatedError extends APIError {
  constructor() {
    super(
      "NotAuthenticatedError: Error occurred due to the user is not authenticated to perform the action."
    );
  }
}
