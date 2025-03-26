import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows errors when form input fields are empty", async () => {
    const user = userEvent.setup();

    render(<Odpy />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button");
    await user.click(submitButton);

    expect(
      screen.getByText("Отсутствует файл экспорта из Sims."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Отсутствует файл экспорта из Пирамида 2."),
    ).toBeInTheDocument();

    expect(screen.getByText("Пустое поле.")).toBeInTheDocument();
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

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("Тип файла не xlsx.")).toHaveLength(2);
    });
  });
});
