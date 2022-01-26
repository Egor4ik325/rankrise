import Authentication from "./authentication";
import { APIError } from "./errors";
import { Questions, Tokens } from "./resources";

// Wrapper around API recourses
export default class APIClient {
  constructor({
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
  }) {
    const tokenFunctions = {
      getAccessToken,
      setAccessToken,
      removeAccessToken,
      getRefreshToken,
      setRefreshToken,
      removeRefreshToken,
    };
    // Assign all token function to this client object (implicitly, not care about type checking)
    Object.assign(this, tokenFunctions);

    // Pass all dependency token functions
    this.authentication = new Authentication(tokenFunctions);
    this.questions = new Questions(tokenFunctions);
    this.tokens = new Tokens(tokenFunctions);

    // Verify token is valid (not expired) otherwise renew access token with refresh token
    // when the client object is constructed (user opens the website)
    // this.validateTokens();
  }

  async validateTokens() {
    // If one of the tokens is missing it should not be a valid session
    if (!this.getAccessToken() || !this.getRefreshToken()) {
      // Set local storage tokens to null
      this.clearTokens();
      return;
    }

    const isValid = await this.tokens.verifyAccessToken();

    if (!isValid) {
      try {
        await this.tokens.renewAccessToken();
      } catch (error) {
        if (error instanceof APIError) {
          // If the refresh token has expired that user is have to login again
          this.clearTokens();

          return;
        }
        throw error;
      }
    }
  }

  clearTokens() {
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}
