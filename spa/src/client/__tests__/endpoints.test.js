import { reverse } from "../endpoints";

it("reverses login url", () => {
  expect(reverse("login")).toEqual("http://localhost/api/auth/login/");
});

it("reverses voit detail with args", () => {
  expect(reverse("voteDetail", {questionPk: 1, optionPk: 2, id: 3})).toEqual("http://localhost/api/questions/1/options/2/votes/3/")
})
