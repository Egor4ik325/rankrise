import Authentication from "./authentication";
import { Questions } from "./resources";

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
  }
}
