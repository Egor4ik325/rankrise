export class LoginError {
  constructor(data) {
    this.message = "Error occurred while trying to login using provided credentials";
    this.name = "LoginError";

    this.data = data;
  }
}
