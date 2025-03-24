import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";

import LoginPage from "./LoginPage";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("LoginPage", () => {
  it("renders Login component", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Обработка XLSX файлов")).toBeTruthy();
    expect(screen.getByText("Войти")).toBeTruthy();

    expect(
      screen.getByText("Введите имя учетной записи и пароль для входа."),
    ).toBeTruthy();

    expect(screen.getByText("Имя учетной записи")).toBeTruthy();
    expect(screen.getByText("Пароль")).toBeTruthy();
  });

  it("shows errors when form input fields are empty", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("button"));

    await flushPromises();

    expect(
      screen.getByText("Отсутствует пароль от учетной записи."),
    ).toBeTruthy();

    expect(
      screen.getByText("Отсутствует пароль от учетной записи."),
    ).toBeTruthy();
  });
});
