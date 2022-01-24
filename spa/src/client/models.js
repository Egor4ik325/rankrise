export class LoginResponse {
  constructor(data) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
  }
}

export class QuestionsResponse {
  constructor(data) {
    this.count = data.count;
    this.next = data.next;
    this.previous = data.previous;
    this.results = data.results.map((result) => new Question(result));
  }
}

export class Question {
  constructor(data) {
    this.pk = data.pk;
    this.title = data.title;
    this.askTime = new Date(data.ask_time);
  }
}
