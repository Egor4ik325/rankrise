import api from "..";

it("gets all questions and tests both endpoint and client", async () => {
  const response = await api.questions.list();

  expect(response.count).toBe(response.results.length);
});
