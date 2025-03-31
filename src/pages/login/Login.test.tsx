import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";

import LoginPage from "./Login";

describe("LoginPage", () => {
  it("renders Login component", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });

    const h1 = screen.getByText("Обработка XLSX файлов");
    expect(h1).toBeInTheDocument();

    const cardTitle = screen.getByText("Войти");
    expect(cardTitle).toBeInTheDocument();

    const cardDescription = screen.getByText(
      "Введите имя учетной записи и пароль для входа.",
    );

    expect(cardDescription).toBeInTheDocument();

    const loginInputFieldLabel = screen.getByText("Имя учетной записи");
    expect(loginInputFieldLabel).toBeInTheDocument();

    const passwordInputFieldLabel = screen.getByText("Пароль");
    expect(passwordInputFieldLabel).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Войти" });
    expect(submitButton).toBeInTheDocument();
  });

  it("shows errors when form input fields are empty", async () => {
    const user = userEvent.setup();

    render(<LoginPage />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button", { name: "Войти" });

    await user.click(submitButton);

    const loginInputFieldError = screen.getByText(
      "Отсутствует имя учетной записи.",
    );

    expect(loginInputFieldError).toBeInTheDocument();

    const passwordInputFieldError = screen.getByText(
      "Отсутствует пароль от учетной записи.",
    );

    expect(passwordInputFieldError).toBeInTheDocument();
  });
});
