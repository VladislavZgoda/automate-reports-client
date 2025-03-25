import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";

import LoginPage from "./Login";

describe("LoginPage", () => {
  it("renders Login component", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });

    expect(screen.getByText("Обработка XLSX файлов")).toBeTruthy();
    expect(screen.getByText("Войти")).toBeTruthy();

    expect(
      screen.getByText("Введите имя учетной записи и пароль для входа."),
    ).toBeTruthy();

    expect(screen.getByText("Имя учетной записи")).toBeTruthy();
    expect(screen.getByText("Пароль")).toBeTruthy();
  });

  it("shows errors when form input fields are empty", async () => {
    const user = userEvent.setup();

    render(<LoginPage />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(
      screen.getByText("Отсутствует пароль от учетной записи."),
    ).toBeTruthy();

    expect(
      screen.getByText("Отсутствует пароль от учетной записи."),
    ).toBeTruthy();
  });
});
