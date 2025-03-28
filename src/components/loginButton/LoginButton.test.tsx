import { render, screen } from "@testing-library/react";

import LoginButton from "./LoginButton";

describe("LoginButton component", () => {
  it("renders the default state of the button if isSubmitting is false", () => {
    render(<LoginButton isSubmitting={false} />);

    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
  });

  it("renders the loading state of the button if isSubmitting is true", () => {
    render(<LoginButton isSubmitting={true} />);

    expect(
      screen.getByRole("button", { name: "Проверка" }),
    ).toBeInTheDocument();
  });
});
