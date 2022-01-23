export class LoginResponse {
  constructor(data) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
  }
}
