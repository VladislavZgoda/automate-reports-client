import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";

import LoginPage from "./Login";

describe("LoginPage", () => {
  it("renders Login component", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });

    expect(screen.getByText("Обработка XLSX файлов")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();

    expect(
      screen.getByText("Введите имя учетной записи и пароль для входа."),
    ).toBeInTheDocument();

    expect(screen.getByText("Имя учетной записи")).toBeInTheDocument();
    expect(screen.getByText("Пароль")).toBeInTheDocument();
  });

  it("shows errors when form input fields are empty", async () => {
    const user = userEvent.setup();

    render(<LoginPage />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(
      screen.getByText("Отсутствует пароль от учетной записи."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Отсутствует пароль от учетной записи."),
    ).toBeInTheDocument();
  });
});
