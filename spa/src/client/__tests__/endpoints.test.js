import { reverse } from "../endpoints";

it("reverses login url", () => {
  expect(reverse("login")).toEqual("http://localhost/api/auth/login/");
});
