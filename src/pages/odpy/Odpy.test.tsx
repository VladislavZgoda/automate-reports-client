import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";

import Odpy from "./Odpy";

describe("Odpy", () => {
  it("renders Odpy component", () => {
    render(<Odpy />, { wrapper: BrowserRouter });

    expect(
      screen.getByText("Сформировать ведомость с ОДПУ"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Добавьте экспорт из Sims в xlsx формате, отчёт по показаниям из Пирамида 2 с диапазоном в 4 суток.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Экспорт из Sims")).toBeInTheDocument();
    expect(screen.getByText("Экспорт из Пирамида 2")).toBeInTheDocument();
    expect(screen.getByText("Контроллер")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Сформировать" }),
    ).toBeInTheDocument();
  });

  it("shows errors when form input fields are empty", async () => {
    const user = userEvent.setup();

    render(<Odpy />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    await user.click(submitButton);

    const simsFileInputFieldError = screen.getByText(
      "Отсутствует файл экспорта из Sims.",
    );

    expect(simsFileInputFieldError).toBeInTheDocument();

    const piramidaFileInputFieldError = screen.getByText(
      "Отсутствует файл экспорта из Пирамида 2.",
    );

    expect(piramidaFileInputFieldError).toBeInTheDocument();

    const controllerInputFieldError = screen.getByText("Пустое поле.");

    expect(controllerInputFieldError).toBeInTheDocument();
  });

  it("shows errors if the file type is not xlsx", async () => {
    render(<Odpy />, { wrapper: BrowserRouter });

    const simsFileInput = screen.getByLabelText("Экспорт из Sims");
    const piramidaFileInput = screen.getByLabelText("Экспорт из Пирамида 2");

    const xlsFile = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    const csvFile = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(simsFileInput, {
      target: { files: { item: () => xlsFile, length: 1, 0: xlsFile } },
    });

    fireEvent.change(piramidaFileInput, {
      target: { files: { item: () => csvFile, length: 1, 0: csvFile } },
    });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    const invalidFileTypeErrors =
      await screen.findAllByText("Тип файла не xlsx.");

    expect(invalidFileTypeErrors).toHaveLength(2);
  });
});
