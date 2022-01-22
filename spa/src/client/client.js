import Authentication from "./authentication";
import { Questions } from "./resources";

// Wrapper around API recourses
export default class APIClient {
  constructor({ getToken }) {
    // Pass getToken
    this.authentication = new Authentication(getToken);
    this.questions = new Questions(getToken);
  }
}
